FROM nginx:latest

# Installe quelques outils utiles
#RUN apt update && apt install -y nano net-tools

# Crée les répertoires pour les virtual hosts
RUN mkdir -p /var/www/crash && mkdir -p /var/www/test

# Copie les fichiers HTML
COPY crash/ /var/www/crash/
COPY test/index.html /var/www/test/index.html

# Copie la config Nginx custom (vhost)
COPY nginx.conf /etc/nginx/nginx.conf

