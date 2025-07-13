import unittest
from unittest.mock import patch, MagicMock
from component_recognition import capture_and_detect
import time
import numpy as np

class TestCaptureAndDetect(unittest.TestCase):
    @patch('cv2.VideoCapture')
    def test_camera_not_opened(self, mock_video_capture):
        # Simuler une caméra qui ne s'ouvre pas
        mock_video_capture.return_value.isOpened.return_value = False

        with self.assertRaises(SystemExit):  # La fonction appelle `exit()`
            capture_and_detect()

        mock_video_capture.assert_called_once_with(0)  # Vérifie que la caméra est appelée avec l'index 0


    @patch('cv2.VideoCapture')
    @patch('cv2.imshow')  # Pour éviter d'afficher la fenêtre
    @patch('ultralytics.YOLO')
    def test_no_detection(self, mock_yolo, mock_imshow, mock_video_capture):
        # Simuler une caméra fonctionnelle
        mock_video_capture.return_value.isOpened.return_value = True

        # Générer une image aléatoire (frame simulée)
        fake_frame = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)

        # Simuler que la caméra retourne des images
        mock_video_capture.return_value.read.side_effect = [
            (True, fake_frame),  # Image 1
            (True, fake_frame),  # Image 2
            (True, fake_frame)   # Image 3
        ]

        # Créer un générateur pour les prédictions YOLO
        mock_result = MagicMock()
        mock_result.boxes.xyxy = []  # Pas de coordonnées
        mock_result.boxes.conf = []  # Pas de scores de confiance

        # Patcher la méthode __call__ de YOLO
        mock_yolo.return_value.__call__.return_value = [mock_result]

        # Simuler un temps d'attente pour tester l'absence prolongée
        with patch('time.time', side_effect=[0, 1, 2, 6]):  # Timestamps simulés
            result = capture_and_detect()

        # Vérifier que le résultat est "null"
        self.assertEqual(result, ['null'])

#  Pour lancer les tests il faut lancer la commande suivante :
#  > python -m unittest test_component_recognition.py