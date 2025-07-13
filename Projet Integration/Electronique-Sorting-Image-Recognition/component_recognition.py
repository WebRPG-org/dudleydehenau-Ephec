import cv2
import time
from ultralytics import YOLO

def capture_and_detect():
    """
    Capture et analyse un flux vidéo en temps réel depuis une caméra, détecte les composants avec un modèle YOLO pré-entrainé, 
    et affiche les résultats. La fonction gère les détections stables, les disparitions de composants et détecte les absences prolongées.

    Fonctionnalités principales :
    - Utilise un modèle YOLO pour détecter des objets sur chaque image capturée depuis la caméra.
    - Détermine si un composant est "stable" lorsqu'il est détecté continuellement pendant une durée spécifiée.
    - Supprime les composants qui disparaissent du champ de vision pendant une période donnée.
    - Renvoie "null" dans le tableau des labels si aucun composant n'est détecté avec un taux de confiance élevé
      pendant une durée définie.

    Paramètres :
        Aucun

    Résultats :
        - Affiche les résultats avec des annotations (bounding boxes) sur le flux vidéo en temps réel.
        - Affiche dans la console les labels des composants stables détectés.
        - Si aucun composant n'est détecté après une durée définie, renvoie "Labels stables détectés : ['null']".

    Exemple d'utilisation :
        >>> capture_and_detect()
    """

    # Charger un modèle pré-entrainé YOLO11n
    model = YOLO("../Traitement-Image-RoboFlow-YOLO-OpenCV-v4-Detecte-Affiche-Renvoi-Elements/V1-4-versions/train722/weights/best.pt")

    # Dictionnaire des labels (classes) et leurs noms
    label_map = {
        0: "CAPACITOR",
        1: "LED",
        2: "RESISTOR",
        3: "TRANSISTOR"
        # Ajouter d'autres classes si nécessaire
    }

    # Ouvre la caméra par défaut (0 est l'index par défaut)
    cap = cv2.VideoCapture(0)

    # Vérifier si la caméra est ouverte correctement
    if not cap.isOpened():
        print("Erreur : Impossible d'accéder à la caméra.")
        exit()

    # Dictionnaire pour stocker les labels et les timestamps de détection
    detected_objects = {}

    # Délai avant de considérer un objet stable ou disparu (en secondes)
    stable_time = 2
    disappear_time = 3
    no_detection_time_limit = 3  # Temps pour considérer qu'il n'y a plus de composant (en secondes)
    last_detection_time = time.time()  # Timestamp de la dernière détection

    while True:
        ret, frame = cap.read() # Lire une image de la caméra
        if not ret:
            print("Erreur : Impossible de lire le flux de la caméra.")
            break

        # Utiliser YOLO pour effectuer des prédictions sur l'image
        results = model(frame)
        frame_time = time.time()  # Timestamp actuel

        # Trouver le label avec la confiance la plus élevée
        highest_confidence_label = None
        highest_confidence_score = 0

        for result in results:
            for box in result.boxes:
                cls = int(box.cls)
                conf = float(box.conf)
                if conf > highest_confidence_score:
                    highest_confidence_score = conf
                    highest_confidence_label = cls

        # Si une détection avec une haute confiance existe
        if highest_confidence_label is not None:
            last_detection_time = frame_time  # Mettre à jour le dernier timestamp de détection
            if highest_confidence_label not in detected_objects:
                # Ajouter l'objet avec le timestamp actuel
                detected_objects[highest_confidence_label] = {
                    "first_seen": frame_time,
                    "last_seen": frame_time,
                    "stable": False
                }
            else:
                # Mettre à jour le timestamp de dernière détection
                detected_objects[highest_confidence_label]["last_seen"] = frame_time

                # Vérifier si l'objet est stable
                if not detected_objects[highest_confidence_label]["stable"]:
                    time_present = frame_time - detected_objects[highest_confidence_label]["first_seen"]
                    if time_present >= stable_time:
                        detected_objects[highest_confidence_label]["stable"] = True

        # Supprimer les objets disparus depuis plus de `disappear_time` secondes
        to_remove = [
            label for label, data in detected_objects.items()
            if frame_time - data["last_seen"] > disappear_time
        ]

        for label in to_remove:
            del detected_objects[label]

        # Afficher les labels stables avec leur nom
        stable_labels = [
            label_map[label] for label, data in detected_objects.items() if data["stable"]
        ]

        # Si aucun composant n'est détecté pendant un temps défini
        if frame_time - last_detection_time > no_detection_time_limit:
            stable_labels = ["null"]

        # Afficher ou envoyer les labels stables
        if stable_labels:
            print("Labels stables détectés :", stable_labels)
            return stable_labels
            
        # Dessiner les résultats directement sur l'image
        # annotated_frame = results[0].plot()  # Ajoute des annotations sur l'image

        # Affiche le flux vidéo avec les annotations
        # cv2.imshow("Component Detection", annotated_frame)

        # Presser 'q' pour quitter le programme
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Couper le processus lier à la caméra et fermer la fenêtre
    cap.release()
    cv2.destroyAllWindows()

# Lancement de la fonction
# capture_and_detect()
