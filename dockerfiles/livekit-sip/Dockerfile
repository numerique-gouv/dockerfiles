ARG GOVERSION=1.24

FROM golang:$GOVERSION AS builder

ARG TARGETPLATFORM

WORKDIR /workspace

# install libopus and gstreamer dependencies
RUN apt-get update && apt-get install -y \
    git \
    pkg-config \
    libopus-dev \
    libopusfile-dev \
    libsoxr-dev \
    libgstreamer1.0-dev \
    libgstreamer-plugins-base1.0-dev \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-libav \
    gstreamer1.0-tools

# Git clone livekit-sip repository from suitenumerique fork
RUN cd /tmp && \
    git clone -b sip-video https://github.com/suitenumerique/livekit-sip.git sip && \
    cd /workspace && \
    cp /tmp/sip/go.mod . && \
    cp /tmp/sip/go.sum . && \
    cp -r /tmp/sip/res . && \
    cp -r /tmp/sip/cmd . && \
    cp -r /tmp/sip/pkg/ . && \
    cp -r /tmp/sip/version/ . && \
    # Replace media-sdk with suitenumerique fork and update dependencies
    go mod edit -replace github.com/livekit/media-sdk=github.com/suitenumerique/media-sdk@sip-video && \
    go mod tidy && \
    go mod download

COPY enter_pin.ogg res/
COPY room_join.ogg res/
COPY wrong_pin.ogg res/

# build
RUN if [ "$TARGETPLATFORM" = "linux/arm64" ]; then GOARCH=arm64; else GOARCH=amd64; fi && \
    CGO_ENABLED=1 GOOS=linux GOARCH=${GOARCH} GO111MODULE=on go build -a -o livekit-sip ./cmd/livekit-sip

FROM golang:$GOVERSION

# install runtime dependencies including gstreamer
RUN apt-get update && \
    apt-get install -y \
    libopus0 \
    libopusfile0 \
    libsoxr0 \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-libav \
    gstreamer1.0-tools && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# copy binary
COPY --from=builder /workspace/livekit-sip /bin/

WORKDIR /sip

# run
ENTRYPOINT ["livekit-sip", "--config=/sip/config.yaml"]
