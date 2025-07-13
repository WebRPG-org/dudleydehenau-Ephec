from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import threading
from script import start_sorting, stop

# Événement pour contrôler l'arrêt du tri
stop_event = threading.Event()

def controlled_start_sorting():
    """Wrapper autour de la fonction start_sorting pour gérer l'arrêt."""
    global stop_event
    stop_event.clear()  # Assurez-vous que l'événement est réinitialisé avant de démarrer
    start_sorting(stop_event)  # Passez l'événement à votre fonction de tri
    
    print("COTROLED")

def controlled_stop():
    """Arrête le tri et déclenche l'événement stop."""
    global stop_event
    stop_event.set()  # Déclenche l'arrêt du tri
    stop()  # Appelle la fonction personnalisée d'arrêt si nécessaire

class RequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Gérer la requête pré-vol CORS
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')  # Autoriser toutes les origines
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')  # Méthodes autorisées
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')  # Headers autorisés
        self.end_headers()

    def do_POST(self):
        if self.path == '/start-sorting':  # Endpoint pour démarrer le tri
            print("STARTED")
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')  # Autoriser toutes les origines
            self.send_header('Content-Type', 'application/json')
            self.end_headers()

            # Exécuter la fonction `controlled_start_sorting` dans un thread
            threading.Thread(target=controlled_start_sorting).start()

            # Réponse JSON
            response = {'message': 'Sorting process started'}
            self.wfile.write(json.dumps(response).encode('utf-8'))

        elif self.path == '/stop-sorting':  # Endpoint pour arrêter le tri
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')  # Autoriser toutes les origines
            self.send_header('Content-Type', 'application/json')
            self.end_headers()

            # Exécuter la fonction `controlled_stop` dans un thread
            threading.Thread(target=controlled_stop).start()

            # Réponse JSON
            response = {'message': 'Sorting process stopped'}
            self.wfile.write(json.dumps(response).encode('utf-8'))

        else:
            # Réponse 404 pour les endpoints inconnus
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        """Supprime les logs du serveur pour éviter l'affichage dans la console."""
        return

# Démarrage du serveur HTTP
def run_server(host='0.0.0.0', port=8000):
    print(f"Starting HTTP server on {host}:{port}")
    server_address = (host, port)
    httpd = HTTPServer(server_address, RequestHandler)
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
