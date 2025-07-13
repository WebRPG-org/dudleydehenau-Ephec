# parking.py
import csv
from .csv_manager import CSVManager  # Utilisez une importation relative ici
from .etage import Etage  # Utilisez une importation relative ici

class Parking:
    def __init__(self, name, floors):
        self._name = name
        self._floors = floors
        self._etages = []  # Ajoutez une liste pour stocker les étages

    def get_name(self):
        return self._name

    def set_name(self, name):
        self._name = name

    def get_floors(self):
        return self._floors

    def set_floors(self, floors):
        self._floors = floors

    def get_etages(self):
        return self._etages

    def set_etages(self, etages):
        self._etages = etages

    def to_csv(self, filename):
        data = [{'name': self._name, 'floors': self._floors}]
        CSVManager.save_to_csv(filename, ['name', 'floors'], data)

        for etage in self._etages:
            etage.to_csv(filename)  # Appel à la méthode to_csv de la classe Etage

    @classmethod
    def from_csv(cls, filename):
        try:
            data = CSVManager.load_from_csv(filename)

            if data:
                parking_data = data[0]
                etages_data = data[1:]

                # Mettez à jour les clés en fonction de votre fichier CSV
                required_keys = ['level', 'number', 'is_handicapped', 'commentaire']

                if all(key in parking_data for key in required_keys):
                    parking = cls(name=parking_data['commentaire'], floors=int(parking_data['number']))
                    parking.set_etages([])

                    for etage_data in etages_data:
                        try:
                            etage = Etage.from_csv(filename, int(etage_data['level']))
                            parking.get_etages().append(etage)
                        except Exception as etage_exception:
                            print(f"Erreur lors de la création de l'étage {etage_data['level']} : {etage_exception}")

                    return parking
                else:
                    print(f"Données manquantes dans le fichier CSV. Clés disponibles : {parking_data.keys()}")
                    return None
            else:
                print("Aucune donnée disponible dans le fichier.")
                return None
        except Exception as e:
            print(f"Une exception s'est produite dans la fonction from_csv de Parking : {e}")
            return None
        
    def reserve_place(self, etage_number, place_number):
        try:
            # Vérifiez si l'étage existe dans le parking
            if 1 <= etage_number <= len(self._etages):
                etage = self._etages[etage_number - 1]  # -1 car les étages sont indexés à partir de 0 dans la liste
            else:
                # Si l'étage n'existe pas, créez-le et ajoutez-le à la liste des étages
                etage = Etage(level=etage_number, places=[])
                self._etages.append(etage)

            # Vérifiez si la place existe dans l'étage
            if 1 <= place_number <= len(etage.get_places()):
                place = etage.get_places()[place_number - 1]  # -1 car les places sont indexées à partir de 0 dans la liste
                # Vérifiez si la place est disponible
                if not place.is_reserved():
                    # Réservez la place
                    place.reserve()
                    print(f"La place {place_number} à l'étage {etage_number} a été réservée avec succès.")
                    return True
                else:
                    print(f"La place {place_number} à l'étage {etage_number} est déjà réservée.")
            else:
                print(f"La place {place_number} n'existe pas dans l'étage {etage_number}.")

            return False
        except Exception as e:
            print(f"Une exception s'est produite dans la fonction reserve_place : {e}")
    
    def display_available_places(self):
        print("Places disponibles dans le parking:")
        for etage_number, etage in enumerate(self._etages, start=1):
            available_places = [place_number + 1 for place_number, place in enumerate(etage.get_places()) if not place.is_reserved()]
            
            if available_places:
                print(f"  Places disponibles à l'étage {etage_number} : {', '.join(map(str, available_places))}")
            else:
                print(f"  Aucune place disponible dans cet étage.")

