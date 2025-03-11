# This dockerfile is adapted from work done by @paulfitz
# https://github.com/gristlabs/gvisor/commit/4208b8fe4e19bb7473cee8bec444c7cae6171d8b

# A recipe for building the gvisor runsc sandbox.  Output is a single file.

FROM alpine/git:v2.47.2 AS sources

# Fetch fork of gvisor supporting an --unprivileged flag.
# See https://github.com/google/gvisor/issues/4371
WORKDIR /

RUN \
  git clone -b paulfitz/grist-2024 https://github.com/gristlabs/gvisor.git

WORKDIR /gvisor

# Checkout to the wanted commit.
RUN \
  git reset --hard 4f03d181471cb965f378db4fb5304cb5a9b2843c

FROM node:22.14.0-alpine3.21 AS runsc-builder

RUN \
  apk update && \
  apk add --no-cache bash=5.2.37-r0

SHELL ["/bin/bash", "-exo", "pipefail", "-c"]

COPY --from=sources /gvisor /gvisor

WORKDIR /gvisor

# We'll need bazel to build gvisor.
RUN \
  npm install @bazel/bazelisk@1.25.0 && \
# Build gvisor. This won't be fast, sorry.
  ./node_modules/@bazel/bazelisk/bazelisk-linux_amd64 build runsc

# Move the single binary produced to /usr/bin/runsc. Its location is a bit unpredictable as it build in a sha256 named directory.
RUN \
  cp "$(find /root/.cache/bazel/_bazel_root/ -iname 'runsc' -type f | head)" /usr/bin/runsc && \
  ls -l /usr/bin/runsc && \
  /usr/bin/runsc help

RUN \
  strip -s /usr/bin/runsc

# All we need is the binary, so drop everything else.
FROM scratch
COPY --from=runsc-builder /usr/bin/runsc /runsc
