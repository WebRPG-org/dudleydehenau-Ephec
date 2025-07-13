import inquirer
from pathlib import Path
from article_for_period import get_top_articles_for_period  # Assurez-vous que la fonction est importée correctement.
from cluster_wordcloud import generate_word_clouds_per_cluster, generate_histograms_per_cluster  # Importer la fonction d'histogramme
import json
import os
from PIL import Image

# Charger les langues depuis le fichier JSON
def charger_langues_disponibles():
    with open(Path(__file__).resolve().parent / "Json/wiki_projects.json", 'r', encoding='utf-8') as f:
        languages_data = json.load(f)
    return languages_data

# Fonction pour visualiser les fichiers dans un dossier
def visualiser_image(image_path):
    try:
        img = Image.open(image_path)
        img.show()
        print(f"Affichage de l'image : {image_path}")
    except Exception as e:
        print(f"Erreur lors de l'ouverture de l'image : {e}")

def récupérer_données_pour_periode():
    # Charger les langues disponibles
    available_languages = charger_langues_disponibles()

    questions = [
        inquirer.List('year', message="Sélectionnez l'année", choices=[str(year) for year in range(2016, 2025)], default="2021"),
        inquirer.Text('month', message="Entrez le mois", default="4"),
        inquirer.Text('day', message="Entrez le jour", default="9"),
        inquirer.List('period', message="Sélectionnez la période", choices=["week", "month", "year", "day"], default="day"),
        inquirer.List('language', message="Sélectionnez la langue", choices=list(available_languages.keys()), default="fr"),
        inquirer.Text('max_articles', message="Nombre maximum d'articles", default="10"),
    ]
    
    answers = inquirer.prompt(questions)

    try:
        result_json = get_top_articles_for_period(int(answers['year']), int(answers['month']), int(answers['day']),
                                                  answers['period'], answers['language'], int(answers['max_articles']))

        with open(Path(__file__).resolve().parent / "Json/period_top_articles.json", 'w', encoding='utf-8') as f:
            f.write(result_json)

        print("Les données ont été récupérées avec succès et enregistrées dans le fichier 'period_top_articles.json'.")
    except Exception as e:
        print(f"Une erreur est survenue lors de la récupération des données : {e}")

def générer_nuages_de_mots():
    available_languages = charger_langues_disponibles()

    questions = [
        #inquirer.Text('json_file_path', message="Chemin du fichier JSON contenant les articles", default=str(Path(__file__).resolve().parent / "Json/period_top_articles.json")),
        inquirer.List('language', message="Sélectionnez la langue", choices=list(available_languages.keys()), default="fr"),
        inquirer.Text('n_clusters', message="Nombre de clusters", default="5"),
        inquirer.Text('max_words', message="Nombre maximum de mots par nuage", default="100"),
    ]
    
    answers = inquirer.prompt(questions)

    selected_language = answers['language']
    stop_words = available_languages[selected_language]['stop_words']

    #json_file_path = answers['json_file_path']
    n_clusters = int(answers['n_clusters'])
    max_words = int(answers['max_words'])

    try:
        output_dir = Path(__file__).resolve().parent / "wordclouds"
        generate_word_clouds_per_cluster(str(Path(__file__).resolve().parent / "Json/period_top_articles.json"), stop_words, n_clusters=n_clusters, output_dir=output_dir, max_words=max_words)
        print("Nuages de mots générés avec succès.")
    except Exception as e:
        print(f"Erreur lors de la génération des nuages de mots : {e}")

def générer_histogrammes():
    available_languages = charger_langues_disponibles()

    questions = [
        #inquirer.Text('json_file_path', message="Chemin du fichier JSON contenant les articles", default=str(Path(__file__).resolve().parent / "Json/period_top_articles.json")),
        inquirer.List('language', message="Sélectionnez la langue", choices=list(available_languages.keys()), default="fr"),
        inquirer.Text('n_clusters', message="Nombre de clusters", default="5"),
        inquirer.Text('max_words', message="Nombre maximum de mots par histogramme", default="100"),
    ]
    
    answers = inquirer.prompt(questions)

    #json_file_path = answers['json_file_path']
    n_clusters = int(answers['n_clusters'])
    max_words = int(answers['max_words'])

    selected_language = answers['language']
    stop_words = available_languages[selected_language]['stop_words']

    try:
        output_dir = Path(__file__).resolve().parent / "histograms"
        generate_histograms_per_cluster(str(Path(__file__).resolve().parent / "Json/period_top_articles.json"), stop_words, n_clusters=n_clusters, output_dir=output_dir, max_words=max_words)
        print("Histogrammes générés avec succès.")
    except Exception as e:
        print(f"Erreur lors de la génération des histogrammes : {e}")

# Fonction pour visualiser les fichiers générés
def visualiser_fichier_généré():
    # Demander à l'utilisateur de sélectionner un fichier
    choices = [
        inquirer.List('type', message="Que voulez-vous visualiser ?", choices=["Nuage de mots", "Histogramme"]),
    ]
    choix_type = inquirer.prompt(choices)
    
    if choix_type['type'] == "Nuage de mots":
        wordcloud_files = [f for f in os.listdir(Path(__file__).resolve().parent / "wordclouds") if f.endswith('.png')]
        choix_fichier = inquirer.prompt([
            inquirer.List('file', message="Sélectionnez un fichier", choices=wordcloud_files)
        ])
        visualiser_image(Path(__file__).resolve().parent / "wordclouds" / choix_fichier['file'])

    elif choix_type['type'] == "Histogramme":
        histogram_files = [f for f in os.listdir(Path(__file__).resolve().parent / "histograms") if f.endswith('.png')]
        choix_fichier = inquirer.prompt([
            inquirer.List('file', message="Sélectionnez un fichier", choices=histogram_files)
        ])
        visualiser_image(Path(__file__).resolve().parent / "histograms" / choix_fichier['file'])

def main():
    while True:
        choices = [
            inquirer.List('action',
                          message="Que voulez-vous faire ?",
                          choices=["Récupérer les données pour une période", "Générer des nuages de mots", "Générer des histogrammes", "Visualiser un fichier", "Quitter le programme"],
                          default="Récupérer les données pour une période")
        ]
        action_choice = inquirer.prompt(choices)

        if action_choice['action'] == "Récupérer les données pour une période":
            récupérer_données_pour_periode()
        elif action_choice['action'] == "Générer des nuages de mots":
            générer_nuages_de_mots()
        elif action_choice['action'] == "Générer des histogrammes":
            générer_histogrammes()
        elif action_choice['action'] == "Visualiser un fichier":
            visualiser_fichier_généré()
        else:
            print("Fin du programme.")
            break

if __name__ == "__main__":
    main()
