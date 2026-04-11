# syntax=docker/dockerfile:1

ARG RUST_VERSION=1.94.1
ARG APP_NAME=dora-site
ARG UID=10001

################################################################################
# Build stage: compile the Rust application on Debian slim

FROM rust:${RUST_VERSION}-trixie AS build
ARG APP_NAME

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

# Install build dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    clang \
    lld \
    git \
    ca-certificates \
    cmake \
    make \
    autoconf \
    automake \
    libtool \
    m4 \
    build-essential \
    libopus-dev \
    libssl-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy manifest and source via bind mounts / cache mounts for fast rebuilds.
# (Use docker build --mount for optimal caching.)
# Compile in release mode, then copy the resulting binary to /bin/server.
COPY Cargo.toml Cargo.lock ./
COPY src/ ./src/

RUN --mount=type=cache,target=/app/target/ \
    --mount=type=cache,target=/usr/local/cargo/git/db \
    --mount=type=cache,target=/usr/local/cargo/registry/ \
    cargo build --locked --release && cp target/release/${APP_NAME} /app/server

################################################################################
# Runtime stage: minimal Debian slim environment

FROM debian:trixie AS final
ARG UID

ENV DEBIAN_FRONTEND=noninteractive

RUN groupadd \
    --gid "${UID}" \
    --system \
    appuser \ 
    && useradd \
    --create-home \
    --uid "${UID}" \
    --gid "${UID}" \
    --no-log-init \
    --system \
    appuser

RUN apt-get update \
    && apt-get install -y \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Switch to unprivileged user
USER appuser

WORKDIR /app

COPY ./templates ./templates
COPY ./static ./static

# Copy the compiled binary from the build stage
COPY --from=build /app/server /app/server

# Expose application port
EXPOSE 3000

# Start the server
CMD ["/app/server"]
