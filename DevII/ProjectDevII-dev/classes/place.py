# place.py
import csv
from .csv_manager import CSVManager  # Utilisez une importation relative ici

class Place:
    def __init__(self, number, is_handicapped, commentaire):
        self._number = number
        self._is_handicapped = is_handicapped
        self._commentaire = commentaire
        self._reserved = False

    def get_number(self):
        return self._number

    def set_number(self, number):
        self._number = number

    def is_handicapped(self):
        return self._is_handicapped

    def set_handicapped(self, is_handicapped):
        self._is_handicapped = is_handicapped

    def get_commentaire(self):
        return self._commentaire

    def set_commentaire(self, commentaire):
        self._commentaire = commentaire

    def is_reserved(self):
        return self._reserved

    def reserve(self):
        self._reserved = True

    def release(self):
        self._reserved = False

    def to_csv(self, filename):
        data = [{'number': self._number, 'is_handicapped': self._is_handicapped, 'commentaire': self._commentaire}]
        CSVManager.save_to_csv(filename, ['number', 'is_handicapped', 'commentaire'], data)

    @classmethod
    def from_csv(cls, filename, place_number):
        try:
            data = CSVManager.load_from_csv(filename)
            if data:
                place_data = next((place_data for place_data in data if int(place_data['number']) == place_number), None)
                if place_data:
                    return cls(number=place_number, is_handicapped=bool(place_data['is_handicapped']), commentaire=place_data['commentaire'])
                else:
                    return None
            else:
                return None
        except Exception as e:
            print(f"Une exception s'est produite dans la fonction from_csv de Place : {e}")
            return None
