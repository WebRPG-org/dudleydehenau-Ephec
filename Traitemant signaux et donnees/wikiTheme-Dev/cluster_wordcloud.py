import os
import shutil
import matplotlib.pyplot as plt
import numpy as np
from collections import Counter
import json
import nltk
from nltk.corpus import stopwords
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from wordcloud import WordCloud

# Télécharger les stopwords pour NLTK
nltk.download("stopwords")

def clear_wordcloud_directory(output_dir):
    """
    Vide le répertoire de nuages de mots en supprimant tous les fichiers.
    """
    if os.path.exists(output_dir):
        # Supprimer tous les fichiers et sous-dossiers dans le répertoire
        for file in os.listdir(output_dir):
            file_path = os.path.join(output_dir, file)
            try:
                if os.path.isfile(file_path):
                    os.remove(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print(f"Erreur lors de la suppression de {file_path}: {e}")
    else:
        os.makedirs(output_dir)

def clear_histogram_directory(output_dir):
    """
    Vide le répertoire des histogrammes en supprimant tous les fichiers.
    """
    if os.path.exists(output_dir):
        # Supprimer tous les fichiers et sous-dossiers dans le répertoire
        for file in os.listdir(output_dir):
            file_path = os.path.join(output_dir, file)
            try:
                if os.path.isfile(file_path):
                    os.remove(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print(f"Erreur lors de la suppression de {file_path}: {e}")
    else:
        os.makedirs(output_dir)

def get_cluster_keywords(tfidf_matrix, vectorizer, labels, n_clusters=5, top_n=10):
    """
    Récupère les mots-clés pour chaque cluster basé sur les poids TF-IDF.
    """
    cluster_keywords = {}

    # Extraire les mots du vocabulaire
    feature_names = np.array(vectorizer.get_feature_names_out())

    # Pour chaque cluster, trouver les mots les plus importants
    for cluster_id in range(n_clusters):
        # Sélectionner les indices des articles appartenant au cluster
        cluster_indices = np.where(labels == cluster_id)[0]

        # Récupérer la matrice TF-IDF pour ce cluster
        cluster_tfidf_matrix = tfidf_matrix[cluster_indices]

        # Calculer la somme des poids TF-IDF pour chaque mot dans le cluster
        tfidf_scores = cluster_tfidf_matrix.sum(axis=0).A1  # A1 pour obtenir un tableau 1D

        # Trier les mots par score TF-IDF
        sorted_indices = np.argsort(tfidf_scores)[::-1]

        # Sélectionner les top_n mots
        top_words = feature_names[sorted_indices][:top_n]

        cluster_keywords[cluster_id] = top_words

    return cluster_keywords


def generate_word_clouds_per_cluster(json_file_path, language, n_clusters=5, output_dir="wordclouds", max_words=100):
    """
    Génère des nuages de mots pour chaque cluster d'articles et affiche un mot-clé pour chaque cluster.
    """
    # Charger les articles JSON
    with open(json_file_path, 'r', encoding='utf-8') as file:
        try:
            articles = json.load(file)
        except json.JSONDecodeError as e:
            print("Erreur de décodage JSON :", e)
            return

    # Récupérer les stopwords pour la langue
    stop_words = set(stopwords.words(language))

    # Extraire les contenus des articles
    contents = [article["content"] for article in articles if "content" in article]

    # Créer la matrice TF-IDF
    vectorizer = TfidfVectorizer(stop_words=list(stop_words), max_features=1000)
    tfidf_matrix = vectorizer.fit_transform(contents)

    # Appliquer K-means pour regrouper les articles
    kmeans = KMeans(n_clusters=n_clusters, random_state=142)
    labels = kmeans.fit_predict(tfidf_matrix)

    # Récupérer les mots-clés pour chaque cluster
    cluster_keywords = get_cluster_keywords(tfidf_matrix, vectorizer, labels, n_clusters, top_n=3)

    # Associer chaque article à son cluster
    cluster_texts = {i: [] for i in range(n_clusters)}
    for idx, label in enumerate(labels):
        cluster_texts[label].append(contents[idx])

    # Vider le répertoire des nuages de mots avant de générer les nouveaux fichiers
    clear_wordcloud_directory(output_dir)

    # Créer un nuage de mots pour chaque cluster
    for cluster_id, texts in cluster_texts.items():
        # Utiliser le premier mot-clé pour le nom du fichier
        cluster_keyword = "_".join(cluster_keywords[cluster_id][:3])  # Utilise les 3 premiers mots-clés pour le nom
        cluster_keyword = cluster_keyword.replace(" ", "_").lower()  # Nettoyer le nom du fichier

        combined_text = " ".join(texts)
        wordcloud = WordCloud(
            width=800, height=800,
            background_color='white',
            stopwords=stop_words,
            min_font_size=10,
            max_words=max_words
        ).generate(combined_text)

        # Créer le nom du fichier basé sur les mots-clés
        output_path = os.path.join(output_dir, f"wordcloud_{cluster_keyword}.png")

        # Sauvegarder le nuage de mots dans un fichier image
        plt.figure(figsize=(8, 8), facecolor=None)
        plt.imshow(wordcloud)
        plt.axis("off")
        plt.tight_layout(pad=0)

        plt.savefig(output_path)
        plt.close()
        print(f"Nuage de mots sauvegardé : {output_path}")


def generate_histograms_per_cluster(json_file_path, language, n_clusters=5, output_dir="histograms", max_words=100):
    """
    Génère des histogrammes pour chaque cluster d'articles représentant la fréquence des mots dans chaque cluster.
    """
    # Charger les articles JSON
    with open(json_file_path, 'r', encoding='utf-8') as file:
        try:
            articles = json.load(file)
        except json.JSONDecodeError as e:
            print("Erreur de décodage JSON :", e)
            return

    # Récupérer les stopwords pour la langue
    stop_words = set(stopwords.words(language))

    # Extraire les contenus des articles
    contents = [article["content"] for article in articles if "content" in article]

    # Créer la matrice TF-IDF
    vectorizer = TfidfVectorizer(stop_words=list(stop_words), max_features=1000)
    tfidf_matrix = vectorizer.fit_transform(contents)

    # Appliquer K-means pour regrouper les articles
    kmeans = KMeans(n_clusters=n_clusters, random_state=142)
    labels = kmeans.fit_predict(tfidf_matrix)

    # Associer chaque article à son cluster
    cluster_texts = {i: [] for i in range(n_clusters)}
    for idx, label in enumerate(labels):
        cluster_texts[label].append(contents[idx])

    # Vider le répertoire des histogrammes avant de générer les nouveaux fichiers
    clear_histogram_directory(output_dir)

    # Générer un histogramme pour chaque cluster
    for cluster_id, texts in cluster_texts.items():
        # Combiner tous les textes du cluster en une seule chaîne
        combined_text = " ".join(texts)
        
        # Tokeniser les mots et enlever les stopwords
        words = [word for word in combined_text.split() if word.lower() not in stop_words]
        
        # Compter la fréquence des mots
        word_counts = Counter(words)
        
        # Récupérer les mots et leurs fréquences
        most_common_words = word_counts.most_common(max_words)

        # Diviser les mots et leurs fréquences pour l'affichage
        words, counts = zip(*most_common_words)

        # Créer le nom du fichier pour sauvegarder l'histogramme
        cluster_keyword = "_".join(words[:3])  # Utiliser les 3 premiers mots pour le nom du fichier
        cluster_keyword = cluster_keyword.replace(" ", "_").lower()

        # Créer un histogramme
        plt.figure(figsize=(10, 6))
        plt.barh(words[::-1], counts[::-1], color='#529ad1')
        plt.xlabel('Fréquence')
        plt.title(f"Mot clé d'histogramme : {cluster_keyword}")
        plt.yticks(fontsize=18)  # Augmenter la taille de police pour les mots
        plt.xticks(fontsize=18) 

        

        output_path = os.path.join(output_dir, f"histogram_{cluster_keyword}.png")

        # Sauvegarder l'histogramme dans un fichier image
        plt.tight_layout()
        plt.savefig(output_path)
        plt.close()
        print(f"Histogramme sauvegardé : {output_path}")


# Exemple d'utilisation
json_file_path = Path(__file__).resolve().parent / "Json/period_top_articles.json"  # Fichier JSON des articles
language = "french"  # Langue pour les stopwords
max_words=10

# Appel des fonctions indépendantes pour générer des nuages de mots et des histogrammes
generate_word_clouds_per_cluster(json_file_path, language, n_clusters=5, output_dir="wordclouds", max_words=max_words)
generate_histograms_per_cluster(json_file_path, language, n_clusters=5, output_dir="histograms", max_words=max_words)
