import requests
from bs4 import BeautifulSoup
import re
import sys
import string

sys.path.append(r"E:\python\novels\backend\scrapers")

from base_scraper import BaseScraper
from common import Novel, Chapter


class KolNovel(BaseScraper):
    def __init__(self, mirrorURL=None):
        self.baseURL = mirrorURL or "https://kolbook.xyz/"

    def optimize_title(self, title):
        title = re.sub(f"[{re.escape(string.punctuation)}]", " ", title)
        # Remove the word "kol" (case insensitive)
        title = re.sub(r"\bkol\b", "", title, flags=re.IGNORECASE)
        # Remove extra spaces
        title = re.sub(r"\s+", " ", title).strip()
        return title

    def search(self, keyword):
        search_url = self.baseURL + f"/?s={keyword}"
        response = requests.get(search_url)

        novels = []

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, "html.parser")
            articles = soup.find_all("article", class_="maindet")

            for article in articles:
                # Extract poster
                poster_elem = article.find("div", class_="mdthumb")

                poster = (
                    poster_elem.find("img").get("src").strip() if poster_elem else "N/A"
                )

                # Extract title and URL
                title_elem = article.find("h2", itemprop="headline").find("a")
                title = (
                    self.optimize_title(title_elem.text.strip())
                    if title_elem
                    else "N/A"
                )
                url = title_elem["href"] if title_elem else "N/A"

                # Extract description
                description_elems = article.find("div", class_="contexcerpt")
                description = (
                    description_elems.text.strip() if description_elems else "N/A"
                )

                # Extract last chapter number
                last_chapter_elem = article.find("span", class_="nchapter")

                if last_chapter_elem:
                    last_chapter_elem = last_chapter_elem.find("a")

                    last_chapter_title = (
                        last_chapter_elem.text.strip() if last_chapter_elem else "N/A"
                    )
                    last_chapter_number = (
                        re.findall(r"\d+", last_chapter_title)
                        if last_chapter_title[-1]
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
                        title=title,
                        author="N/A",
                        description=description,
                        poster=poster,
                        original_title="N/A",
                        chapters="N/A",
                        last_chapter_number=last_chapter_number,
                        url=url,
                    ).to_dict()
                )

            return {"kolnovel": novels}

        else:
            print(f"Failed to retrieve data. Status code: {response.status_code}")

    def get_novel_data(self, url):
        # Implementation
        pass

    def get_chapter_content(self, url):
        # Implementation
        pass


if __name__ == "__main__":
    novel = KolNovel()

    novels = novel.search("aa")

    print(novels)
