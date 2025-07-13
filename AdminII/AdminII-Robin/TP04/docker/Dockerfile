FROM internetsystemsconsortium/bind9:9.18

# Copier les fichiers de config dans l'image
COPY /local/named.conf /etc/bind/named.conf
COPY /local/crash.zone /etc/bind/crash.zone

# Exposer les ports DNS
EXPOSE 53/udp
EXPOSE 53/tcp

# Lancer BIND en avant-plan

#CMD ["/usr/sbin/named", "-f", "-g"]
#CMD ["/usr/bin/named", "-g", "-c", "/etc/bind/named.conf", "-u", "bind"]
