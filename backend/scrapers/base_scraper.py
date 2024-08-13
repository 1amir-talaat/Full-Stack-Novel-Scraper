from abc import ABC, abstractmethod


class BaseScraper(ABC):

    @abstractmethod
    def get_novel_data(self, url):
        pass

    @abstractmethod
    def get_chapter_content(self, url):
        pass

    @abstractmethod
    def search(self, keyword):
        pass
