# Étape 1 : Build
FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

RUN pnpm --filter @codequest/shared install
RUN pnpm --filter @codequest/shared run build

RUN pnpm --filter @codequest/web install
RUN pnpm --filter @codequest/web run build

# Étape 2 : Serveur Nginx Alpine non-root
FROM nginx:alpine

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

