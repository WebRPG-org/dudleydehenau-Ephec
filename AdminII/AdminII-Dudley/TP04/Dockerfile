FROM internetsystemsconsortium/bind9:9.18

ADD ./named.conf /etc/bind/named.conf
ADD ./l2-6.zone /etc/bind/l2-6.zone
RUN chown -R bind:bind /etc/bind/

CMD ["-g", "-c", "/etc/bind/named.conf", "-u", "bind"]
