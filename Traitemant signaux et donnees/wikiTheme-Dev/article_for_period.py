import json
from Content_Utilities.content import fetch_wikipedia_content
from Top_Utilities.sort_top import calculate_cumulative_views
from pathlib import Path

def get_top_articles_for_period(year, month, day, period, language="en", max_articles=None):
    """
    Récupère les articles les plus populaires sur une période et leur contenu, avec une option de limitation.
    
    Args:
        file_path (str): Le chemin vers le fichier JSON contenant les vues.
        year (int): L'année pour récupérer les vues.
        month (int): Le mois pour récupérer les vues.
        day (int): Le jour pour récupérer les vues.
        period (str): La période à analyser ('week', 'month', 'year', 'day').
        language (str): La langue des articles à récupérer, par défaut 'en'.
        max_articles (int, optional): Nombre maximum d'articles à inclure.
    
    Returns:
        str: JSON contenant les articles avec leur contenu et leur classement.
    """
    # Récupérer les articles les plus populaires pour la période spécifiée
    result_json = calculate_cumulative_views(year, month, day, period=period, language=language)
    
    # Charger les résultats sous forme de liste
    top_articles = json.loads(result_json)

    # Liste pour stocker les articles avec leur contenu
    articles_with_content = []

    # Récupérer le contenu de chaque article
    for article in top_articles:
        title = article["article"]
        rank = article["rank"]
        
        # Récupérer le contenu de l'article
        article_content = fetch_wikipedia_content(language, title)
        content = article_content.get("extract", "").strip()
        
        # Ignorer les articles avec un contenu vide
        if not content:
            print(f"Article ignoré : {title} (contenu vide)")
            continue
        
        # Ajouter l'article à la liste si valide
        articles_with_content.append({
            "article": title,
            "rank": rank,
            "content": content
        })

        # Arrêter si on atteint le maximum d'articles
        if max_articles and len(articles_with_content) >= max_articles:
            break

    return json.dumps(articles_with_content, ensure_ascii=False, indent=4)


# Exemple d'utilisation
output_file = Path(__file__).resolve().parent / "Json/period_top_articles.json"  # Nom du fichier où enregistrer le résultat
year = 2016
month = 4
day = 9
period = "day"  # Options: "week", "month", "year", "day"
language = "fr"  # Langue à analyser (par exemple, 'en', 'fr', 'de', 'es')
max_articles = 10  # Limite du nombre d'articles

result_json = get_top_articles_for_period(year, month, day, period, language, max_articles)

# Sauvegarder le résultat dans un fichier JSON
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(result_json)
print(f"Résultat enregistré dans le fichier '{output_file}'.")
