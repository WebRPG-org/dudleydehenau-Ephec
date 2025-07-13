import requests
import json
import os
from pathlib import Path


# Charger le fichier `projects.json` une seule fois
PROJECTS_FILE = Path(__file__).resolve().parent.parent / "Json/wiki_projects.json"
try:
    with open(PROJECTS_FILE, 'r', encoding='utf-8') as file:
        PROJECTS = json.load(file)
except FileNotFoundError:
    print(f"Erreur: Le fichier {PROJECTS_FILE} est introuvable.")
    PROJECTS = {}
except json.JSONDecodeError:
    print(f"Erreur: Le fichier {PROJECTS_FILE} n'est pas un JSON valide.")
    PROJECTS = {}

# Nom du fichier pour stocker les articles localement
ARTICLES_FILE = Path(__file__).resolve().parent.parent / "Json/wiki_articles.json"
if os.path.exists(ARTICLES_FILE):
    try:
        with open(ARTICLES_FILE, 'r', encoding='utf-8') as file:
            ARTICLES_CACHE = json.load(file)
    except json.JSONDecodeError:
        print(f"Erreur: Le fichier {ARTICLES_FILE} n'est pas un JSON valide.")
        ARTICLES_CACHE = {}
else:
    ARTICLES_CACHE = {}

def save_articles_cache():
    """
    Enregistre le cache d'articles dans un fichier JSON.
    """
    try:
        with open(ARTICLES_FILE, 'w', encoding='utf-8') as file:
            json.dump(ARTICLES_CACHE, file, ensure_ascii=False, indent=4)
        print(f"Cache des articles enregistré dans {ARTICLES_FILE}.")
    except Exception as e:
        print(f"Erreur lors de l'enregistrement des articles : {e}")

def fetch_wikipedia_content(language, page_title):
    """
    Récupère le contenu d'une page Wikipedia en utilisant d'abord le cache local,
    puis l'API de Wikipedia si nécessaire.

    Args:
        language (str): Le code de la langue (ex: 'en', 'fr').
        page_title (str): Le titre de la page Wikipedia (ex: 'Donald_Trump').

    Returns:
        dict: Un dictionnaire contenant uniquement le titre et l'extrait si la requête est réussie.
        None: Si la récupération échoue.
    """
    # Vérifier si l'article est déjà dans le cache
    if language in ARTICLES_CACHE and page_title in ARTICLES_CACHE[language]:
        #print(f"Article trouvé dans le cache pour {language}:{page_title}.")
        return ARTICLES_CACHE[language][page_title]

    # Vérifier si le projet existe pour la langue demandée
    if language not in PROJECTS:
        print(f"Erreur: La langue '{language}' n'est pas définie dans les projets.")
        return None

    project = PROJECTS[language]["project"]
    api_url = f"https://{project}.org/w/api.php"
    params = {
        "action": "query",
        "prop": "extracts",
        "exintro": True,
        "explaintext": True,
        "titles": page_title,
        "format": "json"
    }

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(api_url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            pages = data.get("query", {}).get("pages", {})
            for page_id, page_info in pages.items():
                title = page_info.get("title", "Titre inconnu")
                extract = page_info.get("extract", "Aucun contenu disponible")
                article_data = {"title": title, "extract": extract}

                # Mettre à jour le cache local
                if language not in ARTICLES_CACHE:
                    ARTICLES_CACHE[language] = {}
                ARTICLES_CACHE[language][page_title] = article_data

                # Enregistrer le cache
                save_articles_cache()

                return article_data
        else:
            print(f"Erreur: Échec de la récupération des données (Code HTTP: {response.status_code}).")
            return None
    except requests.RequestException as e:
        print(f"Erreur lors de la requête: {e}")
        return None

# Exemple d'utilisation
if PROJECTS:  # Check de si projet est bien chargé.
    page_title = "Diamant"  # Exemple d'article
    language = "fr"  # Exemple de langue
    article = fetch_wikipedia_content(language, page_title)
    if article:
        #print("Contenu récupéré :")
        #print(json.dumps(article, ensure_ascii=False, indent=4))
        pass
else:
    print("Impossible de continuer sans un fichier projects.json valide.")

