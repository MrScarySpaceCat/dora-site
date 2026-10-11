# syntax=docker/dockerfile:1

ARG RUST_VERSION=1.95.0
ARG APP_NAME=dora-site
ARG UID=1000

FROM rust:${RUST_VERSION}-trixie AS build
ARG APP_NAME
ARG UID

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

RUN apt-get update \
    && apt-get install -y \
    cmake \
    libssl-dev \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY Cargo.toml Cargo.lock .cargo ./
COPY src/ ./src/

RUN --mount=type=cache,target=/app/target/ \
    --mount=type=cache,target=/usr/local/cargo/registry/ \
    cargo build --locked --release && cp target/release/${APP_NAME} /app/server

FROM debian:trixie AS final
ARG APP_NAME
ARG UID

LABEL vendor="ClowderTech LLC" \
    maintainer="ClowderTech LLC"

ENV DEBIAN_FRONTEND=noninteractive

RUN groupadd \
    --gid "${UID}" \
    --system \
    appuser \ 
    && useradd \
    --uid "${UID}" \
    --gid "${UID}" \
    --no-log-init \
    --system \
    appuser

# Install only what's needed to run the binary
RUN apt-get update \
    && apt-get install -y \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

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