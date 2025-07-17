ARG GOVERSION=1.24

FROM golang:$GOVERSION AS builder

ARG TARGETPLATFORM

WORKDIR /workspace

# install libopus
RUN apt-get update && apt-get install -y git pkg-config libopus-dev libopusfile-dev libsoxr-dev

# Git clone livekit-sip repository
RUN cd /tmp &&\
  git clone https://github.com/livekit/sip.git && \
  cd sip && \
  git checkout tags/v1.0.0 && \
  cd /workspace && \
  cp /tmp/sip/go.mod . && \
  cp /tmp/sip/go.sum . && \
  go mod download && \
  cp -r /tmp/sip/res . && \
  cp -r /tmp/sip/cmd . && \
  cp -r /tmp/sip/pkg/ . && \
  cp -r /tmp/sip/version/ .

COPY enter_pin.ogg res/
COPY room_join.ogg res/
COPY wrong_pin.ogg res/

# build
RUN if [ "$TARGETPLATFORM" = "linux/arm64" ]; then GOARCH=arm64; else GOARCH=amd64; fi && \
    CGO_ENABLED=1 GOOS=linux GOARCH=${GOARCH} GO111MODULE=on go build -a -o livekit-sip ./cmd/livekit-sip

FROM golang:$GOVERSION

# install wget for health check
RUN apt-get update && \
    apt-get install -y libopus0 libopusfile0 libsoxr0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# copy binary
COPY --from=builder /workspace/livekit-sip /bin/

WORKDIR /sip

# run
ENTRYPOINT ["livekit-sip", "--config=/sip/config.yaml"]
