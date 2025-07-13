import csv
from csv_manager import CSVManager

class Handicape:
    def __init__(self, badge_number):
        self._badge_number = badge_number

    def get_badge_number(self):
        return self._badge_number

    def set_badge_number(self, badge_number):
        self._badge_number = badge_number

    def to_csv(self, filename):
        data = [{'badge_number': self._badge_number}]
        CSVManager.save_to_csv(filename, ['badge_number'], data)

    @classmethod
    def from_csv(cls, filename):
        data = CSVManager.load_from_csv(filename)
        if data:
            return cls(badge_number=data[0]['badge_number'])
        else:
            return None
