import requests
from bs4 import BeautifulSoup, SoupStrainer
from urllib.parse import unquote
import re
import sys
from datetime import datetime
from urllib.parse import unquote, urlparse

from rich import print

sys.path.append(r"E:\python\novels\backend\scrapers")

from base_scraper import BaseScraper
from common import Novel, Chapter


class RiwyatSpace(BaseScraper):
    def __init__(self, mirrorURL=None):
        self.baseURL = mirrorURL or "https://riwyatspace.com/"

    def search(self, keyword):
        search_url = self.baseURL + f"?s={keyword}&post_type=wp-manga"
        response = requests.get(search_url)

        novels = []

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, "html.parser")

            try:
                search_wrap = soup.find("div", class_="search-wrap").find_all(
                    "div", class_="row c-tabs-item__content"
                )
            except AttributeError:
                return {"riwyat": []}

            if not search_wrap:
                return {"riwyat": []}

            for novel_wrap in search_wrap:
                # Extract poster
                poster_elem = novel_wrap.find("div", class_="tab-thumb c-image-hover")
                try:
                    poster = (
                        poster_elem.find("img").get("src").strip()
                        if poster_elem
                        else "N/A"
                    )
                except AttributeError:
                    poster = "N/A"

                # Extract author
                author_elem = novel_wrap.find("div", class_="mg_author")

                if not author_elem:
                    author = "N/A"
                else:
                    author = (
                        author_elem.find("div", class_="summary-content").text.strip()
                        if author_elem
                        else "N/A"
                    )

                # Extract title and url
                title_elem = novel_wrap.find("div", class_="post-title").find("a")
                title = title_elem.text.strip() if title_elem else "N/A"
                url = title_elem.get("href").strip() if title_elem else "N/A"

                # Extract last chapter number
                last_chapter_elem = novel_wrap.find("div", class_="latest-chap")

                if last_chapter_elem:
                    last_chapter_elem = last_chapter_elem.find(
                        "span", class_="chapter"
                    ).find("a")

                    last_chapter_title = (
                        last_chapter_elem.text.strip() if last_chapter_elem else "N/A"
                    )

                    last_chapter_number = (
                        re.findall(r"\d+", last_chapter_title)
                        if last_chapter_title
                        else "N/A"
                    )

                    if last_chapter_number:
                        last_chapter_number = last_chapter_number[0]
                    else:
                        last_chapter_number = "N/A"
                else:
                    last_chapter_number = "N/A"

                novels.append(
                    Novel(
                        title,
                        author=author,
                        description="N/A",
                        poster=poster,
                        chapters="N/A",
                        original_title="N/A",
                        last_chapter_number=last_chapter_number,
                        url=url,
                    ).to_dict()
                )

            return {"riwyat": novels}

        else:
            return {"riwyat": []}

    def extract_chapter_number(self, chapter_title):
        match = re.search(r"\d+", chapter_title)
        return int(match.group()) if match else float("inf")

    def get_novel_data(self, url):
        response = requests.get(url)

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, "html.parser")

            title = soup.find("div", class_="post-title").text.strip()

            original_title = (
                soup.find_all("div", class_="post-content_item")[1]
                .find("div", class_="summary-content")
                .text.strip()
                .replace("\\n", "")
                .replace("\\t", "")
            )

            author = soup.find("div", class_="author-content")
            if not author:
                author = "N/A"
            else:
                author = author.text.strip()

            description = (
                soup.find("div", class_="description-summary")
                .text.strip()
                .replace("\\n", "")
            )

            poster = soup.find("div", class_="summary_image").find("img").get("src")

            chapters_wraper = soup.find("div", class_="listing-chapters_wrap")

            genres = []
            genres_content_elem = soup.find("div", class_="genres-content")
            if genres_content_elem:
                genre_links = genres_content_elem.find_all("a", rel="tag")
                genres = [genre_link.text.strip() for genre_link in genre_links]

            all_chapters_wrapper = chapters_wraper.find_all(
                "li", class_="wp-manga-chapter"
            )

            all_chapters = []

            for chapter in all_chapters_wrapper:
                chapter_data = chapter.find("a")
                chapter_url = chapter_data["href"]
                chapter_title = chapter_data.text.strip()
                all_chapters.append((chapter_title, chapter_url))

            all_chapters.sort(key=lambda x: self.extract_chapter_number(x[0]))

            sorted_chapter_urls = [url for title, url in all_chapters]
            return Novel(
                title=title,
                author=author,
                description=description,
                poster=poster,
                original_title=original_title,
                chapters=sorted_chapter_urls,
                last_chapter_number=len(sorted_chapter_urls),
                genres=genres,
                url=url,
            )

        else:
            return (
                f"Failed to retrieve the webpage. Status code: {response.status_code}"
            )

    def get_chapter_content(self, url):
        response = requests.get(url)

        if response.status_code == 200:

            decoded_url = unquote(url)

            parsed_url = urlparse(decoded_url)

            path_segments = parsed_url.path.split("/")

            # Find volume, chapter
            volume = path_segments[3] if len(path_segments) > 3 else ""
            volume = re.sub(
                r"(\S+)-(\S+)-(\d+)-(\S+)-(\S+)", r"\1 \2 \3: \4 \5", volume
            ).replace("-", " ")

            soup = BeautifulSoup(
                response.content,
                "lxml",
            )

            title = soup.find("ol", class_="breadcrumb").find_all("li")[-1].text.strip()
            title = title.split(" - ")

            if len(title) == 2:
                title = f"{title[0]}: {title[1]}"

            else:
                title = " ".join(title)

            chapter_content = soup.find("div", class_="text-right")

            # Remove unnecessary <p> tags and attributes
            for p_tag in chapter_content.find_all("p"):
                # Remove <p>&nbsp;</p>
                if p_tag.string == "\xa0":
                    p_tag.decompose()
                # Remove specific attributes if present
                elif "style" in p_tag.attrs:
                    del p_tag["style"]

            return Chapter(title, volume, chapter_content)

        else:
            print(
                f"Failed to retrieve the webpage. Status code: {response.status_code}"
            )


if __name__ == "__main__":
    # for testing
    novel = RiwyatSpace()

    start = datetime.now()

    # x = novel.get_novel_data("https://riwyatspace.com/novel/sh-ow-novel/")

    print(novel.search("asfasadgasdgasgfasa"))

    # print(x)

    # print(x["chapters"][2])
    # novel.get_chapter_content(r"https://riwyatspace.com/novel/sh-ow-novel/%d8%a7%d9%84%d9%85%d8%ac%d9%84%d8%af1-%d8%b7%d9%81%d9%84-%d8%a7%d9%84%d8%b8%d9%84%d8%a7%d9%84/%d8%a7%d9%84%d9%81%d8%b5%d9%84-2/")

    end = datetime.now()

    td = (end - start).total_seconds()
    print(f"The time of execution of above program is : {td:.03f}ms")

# novels = novel.search("a")

# print(novels)
