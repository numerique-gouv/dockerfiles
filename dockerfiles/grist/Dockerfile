ARG GRIST_VERSION=1.2.1

FROM gristlabs/grist-oss:$GRIST_VERSION

ARG LASUITE_VERSION=1.0.2
ARG LASUITE_ARCHIVE=gouvfr-lasuite-integration-$LASUITE_VERSION.tgz
ARG BUILD_ENV=DINUM

# La suite's gauffre is expected only in DINUM inmage
RUN if [ "$BUILD_ENV" == "DINUM" ]; then \
    apt-get update &&\
    apt-get install -y wget &&\
    cd /grist/static &&\
    wget https://github.com/numerique-gouv/lasuite-integration/releases/download/integration-v$LASUITE_VERSION/$LASUITE_ARCHIVE &&\
    tar -zxvf $LASUITE_ARCHIVE &&\
    # Archive is extracted as "package"
    # We move it to @gouvfr-lasuite/integration to be complient with
    # https://integration.lasuite.numerique.gouv.fr/guides/gaufre/
    mkdir @gouvfr-lasuite &&\
    mv package @gouvfr-lasuite/integration &&\
    rm $LASUITE_ARCHIVE &&\
    apt-get remove --purge -y wget;\
  fi

COPY ressources/$BUILD_ENV/* /grist/static/
# Favicon is not updated in ANCT context
RUN mv /grist/static/logo.svg /grist/static/ui-icons/Logo/ &&\
  if [ -f /grist/static/favicon.png ]; then\
    mv /grist/static/favicon.png /grist/static/icons/favicon.png;\
  fi

# Variable to force grist to use custom.css and dinum-custom.js
ENV APP_STATIC_INCLUDE_CUSTOM_CSS true
ENV GRIST_INCLUDE_CUSTOM_SCRIPT_URL /v/unknown/custom.js
