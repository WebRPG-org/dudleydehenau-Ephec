from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import threading
from script import start_sorting  # Import your sorting function

class RequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Handle CORS preflight request
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')  # Autoriser toutes les origines
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')  # Méthodes autorisées
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')  # Headers autorisés
        self.end_headers()

    def do_POST(self):
        if self.path == '/start-sorting':  # Check if the correct endpoint is accessed
            # Set CORS headers
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')  # Autoriser toutes les origines
            self.send_header('Content-Type', 'application/json')
            self.end_headers()

            # Execute the `start_sorting` function in a new thread
            threading.Thread(target=start_sorting).start()

            # Return a JSON response
            response = {'message': 'Sorting process started'}
            self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            # Return a 404 response for unknown endpoints
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        """Suppress server logging output to the terminal."""
        return

# Start the server
def run_server(host='0.0.0.0', port=8000):
    print(f"Starting HTTP server on {host}:{port}")
    server_address = (host, port)
    httpd = HTTPServer(server_address, RequestHandler)
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
