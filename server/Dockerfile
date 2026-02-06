FROM node:20
WORKDIR /app
COPY package*.json .
RUN npm install

ENV NODE_ENV=production

COPY . .
EXPOSE 3001

RUN mkdir -p /app/glbs && chown -R node:node /app

USER node
CMD ["node", "src/app.js"]