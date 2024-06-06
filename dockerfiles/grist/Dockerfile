ARG GRIST_VERSION=1.1.14

FROM gristlabs/grist:$GRIST_VERSION

WORKDIR /grist/static

ARG LASUITE_VERSION=1.0.1
ARG LASUITE_ARCHIVE=gouvfr-lasuite-integration-$LASUITE_VERSION.tgz 

RUN apt-get update
RUN apt-get install -y wget

RUN wget https://github.com/numerique-gouv/lasuite-integration/releases/download/integration-v$LASUITE_VERSION/$LASUITE_ARCHIVE
RUN tar -zxvf $LASUITE_ARCHIVE

# Archive is extracted as "package"
# We move it to @gouvfr-lasuite/integration to be complient with
# https://integration.lasuite.numerique.gouv.fr/guides/gaufre/
RUN mkdir @gouvfr-lasuite
RUN mv package @gouvfr-lasuite/integration

RUN rm $LASUITE_ARCHIVE 

COPY ressources/* ./
RUN mv marianne-48x48.png ui-icons/Logo/

RUN apt-get remove --purge -y wget

WORKDIR /grist

RUN \
  groupadd grist -g 10022 && \
  useradd -ms /bin/bash grist -g grist -u 10022 && \
  chown -R grist:grist /grist && \
  chown -R grist:grist /persist

USER grist

# Variable to force grist to use custom.css and dinum-custom.js
ENV APP_STATIC_INCLUDE_CUSTOM_CSS true
ENV GRIST_INCLUDE_CUSTOM_SCRIPT_URL /v/unknown/dinum-custom.js
