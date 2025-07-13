import socket

SERVER_IP = '54.36.181.122'
PORT = 5001

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((SERVER_IP, PORT))

    # Demander une saisie utilisateur
    message = input("Que veux-tu envoyer au serveur ? ")

    # Envoyer le message
    s.sendall(message.encode())

    # Recevoir la réponse (optionnel)
    data = s.recv(1024)
    print("Réponse du serveur :", data.decode())
