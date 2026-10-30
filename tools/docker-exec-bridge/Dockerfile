FROM node:22-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src

# Inside the container the bridge listens on all interfaces; publish it on the host with
# -p 127.0.0.1:10001:10001 so only the laptop itself can reach it.
ENV LISTEN_HOST=0.0.0.0 \
    PORT=10001

USER node
EXPOSE 10001
ENTRYPOINT ["node", "src/server.js"]
