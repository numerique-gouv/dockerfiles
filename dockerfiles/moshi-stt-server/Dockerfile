ARG BASE_IMAGE="nvidia/cuda:12.4.1-devel-ubuntu22.04"
FROM ${BASE_IMAGE}

ARG PYTHON_VERSION
ARG CUDA_COMPUTE_CAP

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV SHELL=/bin/bash
ENV RUSTUP_HOME=/usr/local/rustup
ENV CARGO_HOME=/usr/local/cargo
ENV PATH=/usr/local/cargo/bin:$PATH

# Set the working directory
WORKDIR /

# Create workspace directory
RUN mkdir /workspace

# Update, upgrade, and install packages
RUN apt-get update --yes && \
    apt-get upgrade --yes && \
    apt-get install --yes --no-install-recommends \
        cmake \
        libssl-dev \
        pkg-config \
        git \
        wget \
        curl \
        bash \
        libgl1 \
        software-properties-common \
        openssh-server \
        nginx && \
    if [ -n "${PYTHON_VERSION}" ]; then \
        add-apt-repository ppa:deadsnakes/ppa && \
        apt install "python${PYTHON_VERSION}-dev" "python${PYTHON_VERSION}-venv" -y --no-install-recommends; \
    fi && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    echo "en_US.UTF-8 UTF-8" > /etc/locale.gen

# Set up Python and pip only if PYTHON_VERSION is specified
RUN if [ -n "${PYTHON_VERSION}" ]; then \
    ln -s /usr/bin/python${PYTHON_VERSION} /usr/bin/python && \
    rm /usr/bin/python3 && \
    ln -s /usr/bin/python${PYTHON_VERSION} /usr/bin/python3 && \
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
    python get-pip.py; \
    fi

RUN pip install --upgrade --no-cache-dir pip

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable --profile default
RUN rustc --version

# Install moshi server
RUN cargo install --features cuda moshi-server

# Remove existing SSH host keys
# RUN rm -f /etc/ssh/ssh_host_*

# NGINX Proxy
COPY --from=proxy nginx.conf /etc/nginx/nginx.conf

# Copy the moshi server config
COPY config-stt-en_fr-hf.toml /

## Start Scripts
#COPY post_start.sh /post_start.sh
#COPY --chmod=755 --from=scripts start.sh /
#
## Set the default command for the container
#CMD [ "/start.sh" ]

VOLUME ["/data/hf_cache"]

EXPOSE 8080

CMD ["moshi-server","worker", "--config", "config-stt-en_fr-hf.toml"]
