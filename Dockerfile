FROM node:current-slim

WORKDIR /app

COPY package.json ./

RUN npm install

RUN groupadd clowdertech && useradd -g clowdertech clowdertech \
    && mkdir -p /home/clowdertech/Downloads /app \
    && chown -R clowdertech:clowdertech /home/clowdertech \
    && chown -R clowdertech:clowdertech /app

COPY . .

USER clowdertech

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
