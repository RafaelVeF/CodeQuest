FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared ./packages/shared
COPY services/runner ./services/runner

RUN pnpm --filter @codequest/shared install
RUN pnpm --filter @codequest/shared run build

RUN pnpm --filter @codequest/runner install
RUN pnpm --filter @codequest/runner run build

FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/services/runner/dist ./dist
COPY --from=builder /app/services/runner/node_modules ./node_modules
COPY --from=builder /app/services/runner/package.json ./package.json

CMD ["node", "dist/index.js"]

