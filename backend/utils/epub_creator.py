from ebooklib import epub
import os
import sys
from PIL import Image
from io import BytesIO
import requests

sys.path.append(os.path.join(os.path.dirname(__file__), "scrapers"))

from common import Novel
from scraper_manager import ScraperManager

scraper_manager = ScraperManager()

# Global dictionary to store progress
progress_dict = {}


def create_book_for_novel(novel_data: Novel, query: str):
    global progress_dict  # Ensure we are using the global progress_dict

    progress_dict.clear()

    book = epub.EpubBook()
    book.set_identifier("1")
    book.set_title(novel_data.title)
    book.set_language("ar")
    book.add_author(novel_data.author)

    list_length = len(novel_data.chapters)
    format_string = f"{{:0{len(str(list_length))}}}"

    if novel_data.poster:
        response = requests.get(novel_data.poster)
        cover_image = Image.open(BytesIO(response.content))

        # Convert RGBA to RGB
        if cover_image.mode == "RGBA":
            cover_image = cover_image.convert("RGB")

        cover_image_path = f"{novel_data.title}_cover.jpg"
        cover_image.save(cover_image_path)

        with open(cover_image_path, "rb") as cover_file:
            cover_image_item = epub.EpubImage()
            cover_image_item.file_name = "cover.jpg"
            cover_image_item.content = cover_file.read()

        book.add_item(cover_image_item)
        book.set_cover("cover.jpg", open(cover_image_path, "rb").read())
        os.remove(cover_image_path)

    toc = []
    for index, chapter_url in enumerate(novel_data.chapters):
        chapter_data = get_chapter_content(chapter_url)
        chapter_number = format_string.format(index + 1)
        title = chapter_data.title

        chapter_epub = epub.EpubHtml(
            title=title,
            file_name=f"chap_{chapter_number}.xhtml",
            lang="ar",
        )
        chapter_epub.content = str(chapter_data.content)

        book.add_item(chapter_epub)
        toc.append(
            epub.Link(f"chap_{chapter_number}.xhtml", title, f"chap_{chapter_number}")
        )

        # Update progress
        progress_dict.update(
            {
                "progress": ((index + 1) / list_length) * 100,
                "poster": novel_data.poster,
                "title": novel_data.title,
                "status": title,
                "current": index + 1,
                "end": list_length,
            }
        )

    book.toc = tuple(toc)
    book.add_item(epub.EpubNcx())
    book.add_item(epub.EpubNav())

    save_path = (
        "C:\\Users\\Amir Talaat\\Documents\\novels\\created\\"
        + f"{novel_data.title}.epub"
    )

    epub.write_epub(save_path, book, {})

    # Final progress update
    progress_dict.clear()


def get_chapter_content(url):
    scraper = scraper_manager.get_scraper(url)
    if scraper:
        return scraper.get_chapter_content(url)
    else:
        print(f"No scraper available for this URL: {url}")
        return None


if __name__ == "__main__":
    query = "https://riwyatspace.com/novel/wants-to-live/"
    scraper = scraper_manager.get_scraper(query)
    novel = scraper.get_novel_data(query)
    create_book_for_novel(novel, query)
