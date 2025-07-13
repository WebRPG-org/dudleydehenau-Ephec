import csv
from csv_manager import CSVManager

class Commentaire:
    def __init__(self, text):
        self._text = text

    def get_text(self):
        return self._text

    def set_text(self, text):
        self._text = text

    def to_csv(self, filename):
        data = [{'text': self._text}]
        CSVManager.save_to_csv(filename, ['text'], data)

    @classmethod
    def from_csv(cls, filename):
        data = CSVManager.load_from_csv(filename)
        if data:
            return cls(text=data[0]['text'])
        else:
            return None
