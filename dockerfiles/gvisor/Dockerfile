# This dockerfile is adapted from work done by @paulfitz
# https://github.com/gristlabs/gvisor/commit/4208b8fe4e19bb7473cee8bec444c7cae6171d8b

# A recipe for building the gvisor runsc sandbox.  Output is a single file.

FROM golang:1.24.1 AS runsc-builder

# Fetch fork of gvisor supporting an --unprivileged flag.
# See https://github.com/google/gvisor/issues/4371
WORKDIR /

RUN \
  git clone https://github.com/gristlabs/gvisor.git

WORKDIR /gvisor

# Checkout to the wanted commit of the go branch of gvisor.
# To avoid some complexity we want to build from the go branch rather than with bazel
# Then cherry pick the fork modifications.
RUN \
  git fetch origin bd77833a87a6a58981b1db90a71b961937d74bac && \
  git checkout bd77833a87a6a58981b1db90a71b961937d74bac && \
  git cherry-pick -n 4f03d181471cb965f378db4fb5304cb5a9b2843c

RUN \
  go mod download && \
  mkdir out && \
  CGO_ENABLED=0 GO111MODULE=on go build -o out ./...

RUN \
  strip -s out/runsc

# All we need is the binary, so drop everything else.
FROM scratch
COPY --from=runsc-builder /gvisor/out/runsc /runsc
