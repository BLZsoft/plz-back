FROM node:18-alpine AS builder
RUN corepack enable pnpm

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN pnpm i

COPY . .

RUN pnpm build

FROM node:18-alpine
RUN corepack enable pnpm

COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist/

COPY --from=builder /app/prisma/migrations ./prisma/migrations/
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma

EXPOSE 3000

CMD ["pnpm", "start:prod"]
