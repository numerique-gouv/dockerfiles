ARG VERSION=26.2.5-debian-12-r3

FROM openjdk:15 as builded-jars
COPY . /code
RUN cd /code && jar -cf mappers.jar -C mappers/ .

FROM index.docker.io/bitnami/keycloak:$VERSION as builder
COPY --from=builded-jars /code/mappers.jar /opt/bitnami/keycloak/providers/mappers.jar
USER root
RUN cd /opt/bitnami/keycloak/providers/ \
 && curl -L https://github.com/InseeFr/Keycloak-FranceConnect/releases/download/6.2.0/keycloak-franceconnect-6.2.0.jar -o ./keycloak-franceconnect-6.2.0.jar \
 && /opt/bitnami/keycloak/bin/kc.sh build --features="scripts"
USER keycloak
