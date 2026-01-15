FROM denoland/deno:debian-2.6.4

WORKDIR /app

COPY package.json ./

RUN deno install

RUN groupadd clowdertech && useradd -g clowdertech clowdertech \
    && mkdir -p /home/clowdertech/Downloads /app \
    && chown -R clowdertech:clowdertech /home/clowdertech \
    && chown -R clowdertech:clowdertech /app

USER clowdertech

COPY . .

RUN deno task build

EXPOSE 3000

CMD ["deno", "task", "start"]
