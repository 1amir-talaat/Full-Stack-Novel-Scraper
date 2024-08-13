class Novel:

    def __init__(
        self,
        title,
        original_title,
        author,
        description,
        poster,
        chapters,
        last_chapter_number,
        url,
        genres=[],
    ):
        self.url = url
        self.title = title
        self.original_title = original_title
        self.author = author
        self.description = description
        self.poster = poster
        self.genres = genres
        self.last_chapter_number = last_chapter_number
        self.chapters = chapters  # List of tuples (chapter_title, chapter_url)

    def to_dict(self):
        return {
            "title": self.title,
            "author": self.author,
            "description": self.description,
            "poster": self.poster,
            "chapters": self.chapters,
            "last_chapter_number": self.last_chapter_number,
            "url": self.url,
            "genres": self.genres,
            "original_title": self.original_title,
        }


class Chapter:
    def __init__(self, title, volume, content):
        self.title = title
        selfvolume = volume
        self.content = content
