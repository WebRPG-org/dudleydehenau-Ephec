import cv2
import time
from ultralytics import YOLO

def capture_and_detect(timeout=10, stop_event=None):
    """
    Captures an image from the camera, detects objects using YOLO,
    and returns the label of a detected object after it is stable.
    Returns None if no object is detected within the timeout period.

    Parameters:
        timeout (int): Maximum time (in seconds) to wait for a detection.
        stop_event (threading.Event): Event to signal stopping the function.

    Returns:
        str or None: The label of the detected object, or None if no object is detected.
    """
    # Vérification que stop_event est un threading.Event
    if stop_event is None:
        import threading
        stop_event = threading.Event()

    model = YOLO("/home/username/Desktop/Electronic-Sorting-Project/Image/V1-4-versions/train722/weights/best.pt")

    label_map = {
        0: "Capacitor",
        1: "Led",
        2: "Resistor",
        3: "Transistor"
    }

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Erreur : Impossible d'accéder à la caméra.")
        return None

    detected_objects = {}
    stable_time = 2
    start_time = time.time()

    while not stop_event.is_set():  # Correction ici
        ret, frame = cap.read()
        if not ret:
            print("Erreur : Impossible de lire le flux de la caméra.")
            break

        results = model(frame)
        frame_time = time.time()

        highest_confidence_label = None
        highest_confidence_score = 0

        for result in results:
            for box in result.boxes:
                cls = int(box.cls)
                conf = float(box.conf)
                if conf > highest_confidence_score:
                    highest_confidence_score = conf
                    highest_confidence_label = cls

        if highest_confidence_label is not None:
            if highest_confidence_label not in detected_objects:
                detected_objects[highest_confidence_label] = {
                    "first_seen": frame_time,
                    "last_seen": frame_time,
                    "stable": False
                }
            else:
                detected_objects[highest_confidence_label]["last_seen"] = frame_time
                if not detected_objects[highest_confidence_label]["stable"]:
                    time_present = frame_time - detected_objects[highest_confidence_label]["first_seen"]
                    if time_present >= stable_time:
                        detected_objects[highest_confidence_label]["stable"] = True

        for label, data in detected_objects.items():
            if data["stable"]:
                stable_label = label_map[label]
                print(f"Objet stable détecté : {stable_label}")
                cap.release()
                return stable_label

        if frame_time - start_time > timeout:
            print("Temps écoulé sans détection stable.")
            break

        # Ajout d'un petit délai pour réduire la charge du processeur
        time.sleep(0.1)

    cap.release()
    return None
