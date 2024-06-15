FROM node:20.12.2-alpine3.19
WORKDIR /fiscalismia-frontend/
COPY ./public/ ./public
COPY index.html LICENSE vite.config.ts package-lock.json package.json tsconfig.json ./
RUN npm install
ENTRYPOINT ["npm", "run", "host"]
# tests folder later for workflow