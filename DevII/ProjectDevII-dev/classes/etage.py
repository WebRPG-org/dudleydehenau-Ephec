import csv
from .csv_manager import CSVManager  # Utilisez une importation relative ici
from .place import Place  # Utilisez une importation relative ici

class Etage:
    def __init__(self, level, places):
        self._level = level
        self._places = places

    def get_level(self):
        return self._level

    def set_level(self, level):
        self._level = level

    def get_places(self):
        return self._places

    def set_places(self, places):
        self._places = places

    def to_csv(self, filename):
        data = [{'level': self._level}]
        CSVManager.save_to_csv(filename, ['level'], data)

        for place in self._places:
            place.to_csv(filename)  # Appel à la méthode to_csv de la classe Place

    @classmethod
    def from_csv(cls, filename, level):
        try:
            data = CSVManager.load_from_csv(filename)
            if data:
                places_data = [place_data for place_data in data if int(place_data['level']) == level]
                places = []
                for place_data in places_data:
                    try:
                        place_number = int(place_data['number'])
                        place = Place.from_csv(filename, place_number)
                        places.append(place)
                    except Exception as place_exception:
                        print(f"Erreur lors de la création de la place {place_number} : {place_exception}")

                return cls(level=level, places=places)
            else:
                print("Aucune donnée disponible dans le fichier.")
                return None
        except Exception as e:
            print(f"Une exception s'est produite dans la fonction from_csv de Etage : {e}")
            return None