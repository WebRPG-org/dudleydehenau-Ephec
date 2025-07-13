# interface.py
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from classes.csv_manager import CSVManager
from classes.parking import Parking
from inquirer import prompt, List


# Créez une instance de Parking au début du programme
parking = Parking(name="Nom du parking", floors=4)

def choose_file():
    # Utilisez la méthode choose_file de CSVManager pour permettre à l'utilisateur de choisir un fichier
    CSVManager.choose_file()

def reserve_place():
    # Logique pour réserver une place dans le parking
    try:
        etage_number = int(input("Entrez le numéro d'étage : "))
        place_number = int(input("Entrez le numéro de place : "))

        success = parking.reserve_place(etage_number, place_number)

        if success:
            print(f"La place {place_number} à l'étage {etage_number} a été réservée avec succès.")
        else:
            print("Impossible de réserver la place. Veuillez vérifier les numéros d'étage et de place.")
    except ValueError:
        print("Veuillez entrer un numéro entier pour l'étage et la place.")

def release_place():
    # Logique pour libérer une place
    pass

def display_available_places():
    # Utilisez la méthode get_data de CSVManager pour accéder aux données
    data = CSVManager.get_data()

    # Vérifiez si des données sont disponibles
    if data:
        parking.set_etages([])  # Réinitialisez les étages avant de charger depuis les données CSV
        parking.from_csv(CSVManager.get_current_file())  # Chargez à nouveau les données dans le parking

        print("Places disponibles dans le parking:")
        for etage_number, etage in enumerate(parking.get_etages(), start=1):
            print(f"Étage {etage_number}:")

            available_places = [f"Place {place_number}" for place_number, place in enumerate(etage.get_places(), start=1) if not place.is_reserved()]

           
            print("  " + ", ".join(available_places))
            
    else:
        print("Aucune donnée disponible. Veuillez choisir un fichier CSV.")

def main_menu():
    questions = [
        List('action', message='Choisissez une action', choices=[
            'Réserver une place',
            'Libérer une place',
            'Afficher les places disponibles',
            'Quitter le programme',
        ]),
    ]
    while True:
        answers = prompt(questions)
        action = answers['action']

        if action == 'Réserver une place':
            reserve_place()
        elif action == 'Libérer une place':
            release_place()
        elif action == 'Afficher les places disponibles':
            display_available_places()
        elif action == 'Quitter le programme':
            break
        else:
            print("Action non reconnue. Veuillez réessayer.")

if __name__ == "__main__":
    main_menu()
