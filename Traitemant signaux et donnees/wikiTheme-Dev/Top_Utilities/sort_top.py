from .top import fetch_data_for_period, load_historical_data, save_historical_data
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path
import json


def calculate_cumulative_views(year, month, day, period="month", language="en"):
    """
    Calcule les vues cumulées des articles sur une période spécifique pour une langue donnée 
    et ajuste leur classement. Si des données sont manquantes, elles sont récupérées.

    Args:
        file_path (str): Le chemin vers le fichier JSON contenant les données des vues par jour.
        year (int): L'année à traiter (ex: 2023).
        month (int): Le mois à traiter (1-12). Pour une année complète, mettre 1.
        day (int): Le jour à traiter (1-31). Pour une année ou un mois complet, mettre 1.
        period (str): La période à considérer ('week', 'month', 'year', 'day').
        language (str): La langue à traiter (ex: 'en', 'fr').

    Returns:
        str: Un tableau JSON formaté contenant les articles, leurs vues cumulées,
             et leur rang recalibré en fonction des vues totales sur la période spécifiée.
    """
    # Charger les données historiques existantes
    historical_data = load_historical_data(Path(__file__).resolve().parent.parent / "Json/Historique_top.json"  )
    
    if language not in historical_data:
        historical_data[language] = {}

    # Dictionnaire pour stocker les vues cumulées
    cumulative_data = defaultdict(int)

    # Définir les dates à parcourir en fonction de la période
    if period == "week":
        start_date = datetime(year, month, day)
        end_date = start_date + timedelta(days=6)
        date_range = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]
    elif period == "month":
        start_date = datetime(year, month, 1)
        end_date = (start_date.replace(month=month % 12 + 1, day=1) - timedelta(days=1))
        date_range = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]
    elif period == "year":
        start_date = datetime(year, 1, 1)
        end_date = datetime(year, 12, 31)
        date_range = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]
    elif period == "day":
        date_range = [datetime(year, month, day)]
    else:
        raise ValueError("La période spécifiée doit être 'week', 'month', 'year' ou 'day'.")

    # Vérifier les données manquantes
    missing_dates = [
        date.strftime('%Y-%m-%d') for date in date_range
        if date.strftime('%Y-%m-%d') not in historical_data[language]
    ]

    if missing_dates:
        print(f"Des données manquent pour les dates : {missing_dates}. Récupération en cours...")
        for date in missing_dates:
            date_obj = datetime.strptime(date, "%Y-%m-%d")
            fetch_data_for_period(language, date_obj.year, date_obj.month, date_obj.day, period_type="day")
        # Recharger les données mises à jour
        historical_data = load_historical_data(Path(__file__).resolve().parent.parent / "Json/Historique_top.json")

    # Accumuler les données disponibles
    for date in date_range:
        date_str = date.strftime('%Y-%m-%d')
        if date_str in historical_data[language]:
            _accumulate_views(historical_data[language][date_str], cumulative_data)

    # Convertir les données cumulées en liste triée par vues décroissantes
    sorted_data = sorted(
        [{"article": article, "views": views} for article, views in cumulative_data.items()],
        key=lambda x: x["views"],
        reverse=True
    )

    # Ajouter les rangs recalibrés
    for rank, entry in enumerate(sorted_data, start=1):
        entry["rank"] = rank

    top_1000 = sorted_data[:1000]

    # Retourner en format JSON
    return json.dumps(top_1000, ensure_ascii=False, indent=4)


def _accumulate_views(daily_data, cumulative_data):
    """
    Accumule les vues pour une journée donnée.

    Args:
        daily_data (dict): Données des vues pour un jour spécifique.
        cumulative_data (defaultdict): Dictionnaire cumulatif pour les vues.
    """
    if "items" in daily_data:
        for item in daily_data["items"]:
            if "articles" in item:
                for article_data in item["articles"]:
                    article_name = article_data["article"]
                    views = article_data["views"]
                    cumulative_data[article_name] += views

# Exemple d'utilisation
file_path = Path(__file__).resolve().parent.parent / "Json/Historique_top.json"  
output_file = "output.json"  # Nom du fichier où enregistrer le résultat
year = 2024
month = 1
day = 1
period = "day"  # Options: "week", "month", "year", "day"
language = "fr"  # Langue à analyser (par exemple, 'en', 'fr', 'de')

try:
    result = calculate_cumulative_views(file_path, year, month, day, period, language)
    
    # Enregistrer dans un fichier JSON
    #with open(output_file, 'w', encoding='utf-8') as f:
    #    f.write(result)
    
    print(f"Résultat enregistré dans le fichier '{output_file}'.")
except ValueError as e:
    print(f"Erreur : {e}")
except Exception as e:
    print(f"Erreur inattendue : {e}")

