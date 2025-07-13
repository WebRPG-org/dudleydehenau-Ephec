import csv
import os
from os import listdir
from os.path import isfile, join
from inquirer import prompt, List

class CSVManager:
    _current_file = None
    _data = []  # Variable pour stocker les données CSV

    @classmethod
    def set_current_file(cls, filename):
        cls._current_file = filename

    @classmethod
    def get_current_file(cls):
        return cls._current_file

    @classmethod
    def get_data(cls):
        return cls._data

    @classmethod
    def set_data(cls, data):
        cls._data = data

    @classmethod
    def choose_file(cls):
        # Récupérez la liste des fichiers CSV dans le dossier 'data'
        data_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
        csv_files = [f for f in listdir(data_folder) if isfile(join(data_folder, f)) and f.endswith('.csv')]

        # Si des fichiers CSV sont disponibles, proposez-les à l'utilisateur
        if csv_files:
            questions = [
                List('file', message='Choisissez un fichier CSV', choices=csv_files),
            ]
            answers = prompt(questions)
            if answers:
                cls.set_current_file(join(data_folder, answers['file']))
                print(f"Le fichier choisi est : {cls.get_current_file()}")

                # Charger les données CSV à partir du fichier choisi
                cls.load_from_csv(cls.get_current_file())
        else:
            print("Aucun fichier CSV disponible dans le dossier 'data'. Veuillez en ajouter.")

    @staticmethod
    def save_to_csv(filename, header, data):
        with open(filename, 'w', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=header)
            writer.writeheader()
            writer.writerows(data)
        # Mettez à jour le chemin du fichier actuel après la sauvegarde
        CSVManager.set_current_file(filename)
        # Mettez à jour les données
        CSVManager.set_data(data)

    @classmethod
    def load_from_csv(cls, relative_path):
        # Obtenez le chemin absolu à partir du chemin relatif
        absolute_path = os.path.abspath(os.path.join(os.path.dirname(__file__), relative_path))

        if not os.path.exists(absolute_path):
            print("Le fichier n'existe pas.")
            return []
        data = []
        try:
            with open(absolute_path, 'r') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    data.append(row)
            # Mettez à jour les données
            cls.set_data(data)
        except Exception as e:
            print(f"Erreur lors du chargement du fichier CSV : {e}")

        return data
