import requests
import json
from datetime import datetime, timedelta
import os
from pathlib import Path


def load_projects(file_path= Path(__file__).resolve().parent.parent / "Json/wiki_projects.json"):
    """
    Charge le fichier JSON contenant les associations entre langues, projets et pays.
    
    Args:
        file_path (str): Le chemin vers le fichier JSON des projets Wikimedia.
    
    Returns:
        dict: Un dictionnaire avec les données des projets.
    """
    try:
        with open(file_path, "r") as file:
            return json.load(file)
    except Exception as e:
        print(f"Erreur lors du chargement du fichier {file_path}: {e}")
        return {}

def load_historical_data(file_path=Path(__file__).resolve().parent.parent / "Json/Historique_top.json"):
    """
    Charge les données historiques du fichier JSON (si elles existent).
    
    Args:
        file_path (str): Le chemin vers le fichier JSON de l'historique.
    
    Returns:
        dict: Les données historiques ou un dictionnaire vide si le fichier n'existe pas.
    """
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as file:
            return json.load(file)
    else:
        return {}

def save_historical_data(data, file_path=Path(__file__).resolve().parent.parent / "Json/Historique_top.json"):
    """
    Enregistre les données historiques dans un fichier JSON, triées par langue et date.
    
    Args:
        data (dict): Les données à enregistrer.
        file_path (str): Le chemin vers le fichier JSON de l'historique.
    """
    # Trier les données par langue et date
    sorted_data = {language: dict(sorted(language_data.items())) for language, language_data in data.items()}

    # Sauvegarder les données triées
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(sorted_data, file, indent=4)

def fetch_pageviews_with_headers(language, year, month, day):
    """
    Permet de récupérer les 1000 articles les plus regardés pour une date précise.

    Args:
        language (str): Le code de la langue (ex: 'en', 'fr').
        year (int): Spécifie l'année. Format YYYY.
        month (int): Spécifie le mois. Format MM.
        day (int): Spécifie le jour. Format DD.
    """
    projects = load_projects()  # Charger les projets à partir du fichier JSON

    if language not in projects:
        print(f"Langue '{language}' non supportée.")
        return None
    
    project_data = projects[language]
    project = project_data["project"]
    country = project_data["country"]

    # Construction de l'URL avec le projet Wikimedia et la date
    base_url = f"https://wikimedia.org/api/rest_v1/metrics/pageviews/top/{project}/all-access/{year}/{month:02}/{day:02}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }
    #print(f"Essai de récupération des données pour le projet {project} ({country}) avec l'URL: {base_url}...")

    response = requests.get(base_url, headers=headers)
    #print(f"Code de statut HTTP: {response.status_code}")

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Échec de la récupération des données avec l'URL: {base_url}")
        #print(f"Contenu de la réponse: {response.text}")    
        return None

def fetch_data_for_period(language, year, month, day, period_type='day'):
    """
    Récupère les données des articles les plus regardés pour un jour, une semaine, un mois ou une année,
    et les enregistre dans un fichier JSON.

    Args:
        language (str): Le code de la langue (ex: 'en', 'fr').
        year (int): L'année (YYYY).
        month (int): Le mois (MM).
        day (int): Le jour (DD).
        period_type (str): Le type de période ('day', 'week', 'month', 'year').
    
    Returns:
        dict: Les données récupérées pour la période spécifiée.
    """
    # Charger les données historiques
    historical_data = load_historical_data()

    # Dictionnaire pour stocker les données de la période
    period_data = {}

    if language not in historical_data:
        historical_data[language] = {}

    if period_type == 'day':
        formatted_date = f"{year}-{month:02}-{day:02}"

        # Vérifier si les données sont déjà enregistrées
        if formatted_date in historical_data[language]:
            #print(f"Données déjà présentes pour le jour {formatted_date}, récupération des données existantes.")
            period_data[formatted_date] = historical_data[language][formatted_date]
        else:
            #print(f"Récupération des données pour le jour {formatted_date}...")
            daily_data = fetch_pageviews_with_headers(language, year, month, day)
            if daily_data:
                period_data[formatted_date] = daily_data
                historical_data[language][formatted_date] = daily_data

    elif period_type == 'week':
        start_date = datetime(year, month, day)
        for i in range(7):
            current_day = start_date + timedelta(days=i)
            formatted_date = current_day.strftime('%Y-%m-%d')

            # Vérifier si les données sont déjà enregistrées
            if formatted_date in historical_data[language]:
                #print(f"Données déjà présentes pour le jour {formatted_date}, récupération des données existantes.")
                period_data[formatted_date] = historical_data[language][formatted_date]
            else:
                #print(f"Récupération des données pour la semaine pour le {formatted_date}...")
                daily_data = fetch_pageviews_with_headers(language, current_day.year, current_day.month, current_day.day)
                if daily_data:
                    period_data[formatted_date] = daily_data
                    historical_data[language][formatted_date] = daily_data

    elif period_type == 'month':
        first_day_of_month = datetime(year, month, 1)
        last_day_of_month = (first_day_of_month.replace(month=month % 12 + 1, day=1) - timedelta(days=1)).day
        for day in range(1, last_day_of_month + 1):
            formatted_date = f"{year}-{month:02}-{day:02}"

            # Vérifier si les données sont déjà enregistrées
            if formatted_date in historical_data[language]:
                #print(f"Données déjà présentes pour le jour {formatted_date}, récupération des données existantes.")
                period_data[formatted_date] = historical_data[language][formatted_date]
            else:
                #print(f"Récupération des données pour le mois pour le {formatted_date}...")
                daily_data = fetch_pageviews_with_headers(language, year, month, day)
                if daily_data:
                    period_data[formatted_date] = daily_data
                    historical_data[language][formatted_date] = daily_data

    elif period_type == 'year':
        first_day_of_year = datetime(year, 1, 1)
        last_day_of_year = datetime(year, 12, 31)
        current_day = first_day_of_year
        while current_day <= last_day_of_year:
            formatted_date = current_day.strftime('%Y-%m-%d')

            # Vérifier si les données sont déjà enregistrées
            if formatted_date in historical_data[language]:
                #print(f"Données déjà présentes pour le jour {formatted_date}, récupération des données existantes.")
                period_data[formatted_date] = historical_data[language][formatted_date]
            else:
                #print(f"Récupération des données pour l'année pour le {formatted_date}...")
                daily_data = fetch_pageviews_with_headers(language, current_day.year, current_day.month, current_day.day)
                if daily_data:
                    period_data[formatted_date] = daily_data
                    historical_data[language][formatted_date] = daily_data
            current_day += timedelta(days=1)

    # Sauvegarder les données mises à jour, triées par langue et date
    save_historical_data(historical_data)

    return period_data

#if __name__ == "__main__":
    # Exemple : récupérer les données pour une année
    #print(fetch_data_for_period("en", 2023, 1, 1, period_type='year'))
    
    # Exemple : récupérer les données pour un mois
    # print(fetch_data_for_period("fr", 2024, 10, 1, period_type='month'))

    # Exemple : récupérer les données pour une semaine
    # print(fetch_data_for_period("fr", 2024, 10, 1, period_type='week'))

    # Exemple : récupérer les données pour un jour
    # print(fetch_data_for_period("fr", 2024, 10, 1, period_type='day'))
