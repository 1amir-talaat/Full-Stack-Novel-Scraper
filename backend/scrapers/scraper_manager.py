from urllib.parse import urlparse
import sys
from scrapers.website.kolnovel import KolNovel
from scrapers.website.riwyatspace import RiwyatSpace


class ScraperManager:

    def __init__(self):
        self.scrapers = {
            "riwyatspace.com": RiwyatSpace(),
            "kolbook.xyz": KolNovel(),
        }

    def get_scraper(self, url):
        domain = urlparse(url).netloc
        return self.scrapers.get(domain)

    def search_novel(self, query):
        results = []
        for scraper in self.scrapers.values():
            novel = scraper.search(query)
            if self.has_values(novel):
                results.append(novel)
        return results

    def has_values(self, data):
        if isinstance(data, dict):
            for key, value in data.items():
                if value:  # Check if the list is not empty
                    return True
        return False


if __name__ == "__main__":
    ScraperManager = ScraperManager()

    print(ScraperManager.search_novel("asdasdasdasass"))
