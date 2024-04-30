FROM golang:1.22.2


RUN apt update ;\
  apt install -y git fuse ;\
  git clone https://github.com/kahing/goofys.git ;\
  cd goofys ;\
  go get github.com/kahing/goofys ;\
  go install github.com/kahing/goofys ;\
  curl -sSL -o /usr/local/bin/catfs \
  https://github.com/kahing/catfs/releases/download/v0.8.0/catfs ;\
  chmod +x /usr/local/bin/catfs

ARG ENDPOINT
ENV MOUNT_DIR /mnt/s3
ENV REGION us-east-1
ENV BUCKET teleport-bucket
ENV STAT_CACHE_TTL 1m0s
ENV TYPE_CACHE_TTL 1m0s
ENV DIR_MODE 0770
ENV FILE_MODE 0660
ENV UID 0
ENV GID 0

RUN mkdir /mnt/s3

VOLUME /mnt/s3

ADD entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
