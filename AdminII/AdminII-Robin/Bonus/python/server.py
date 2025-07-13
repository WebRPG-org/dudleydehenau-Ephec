import socket
import subprocess

def run_cmd(cmd):
    try:
        return subprocess.check_output(cmd, shell=True).decode()
    except subprocess.CalledProcessError as e:
        return f"Erreur : {e}"

HOST = '0.0.0.0'
PORT = 5001

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()
    print(f"Serveur en écoute sur le port {PORT}...")

    while True:
        conn, addr = s.accept()
        with conn:
            print(f"Connexion de {addr}")


            password = conn.recv(1024).decode()
            if password != "999":
                conn.sendall("Wrong password".encode())
                conn.sendall("1".encode())
                continue
            else:
                conn.sendall("0".encode())


            data = conn.recv(1024).decode()
            print(f"Commande demandée : {data}")

            try:
                choix = int(data)
                if choix == 1:
                    message = run_cmd("whoami")
                elif choix == 2:
                    message = run_cmd("sudo ps aux")
                elif choix == 3:
                    message = run_cmd("sudo ss -ptnlu")
                elif choix == 4:
                    message = run_cmd("docker container ls")
                else:
                    message = "entrez un nombre entre 1 et 4"
            except ValueError:
                message = "Entrée non valide"

            conn.sendall(message.encode())
