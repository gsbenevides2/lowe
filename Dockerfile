# syntax=docker/dockerfile:1
FROM oven/bun:1
WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000
CMD ["bun", "run", "server/index.ts"]
