FROM quay.io/keycloak/keycloak:26.3
ADD --chown=keycloak:keycloak --chmod=644 https://github.com/InseeFr/Keycloak-FranceConnect/releases/download/7.1.0/keycloak-franceconnect-7.1.0.jar /opt/keycloak/providers/keycloak-franceconnect-7.1.0.jar
RUN /opt/keycloak/bin/kc.sh build
