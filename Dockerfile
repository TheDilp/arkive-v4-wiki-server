# Stage 1: Build stage
FROM oven/bun:latest AS builder
WORKDIR /usr/src/app
ENV HUSKY=0
ENV NODE_ENV=production
COPY . .
RUN bun install --production
RUN bun build ./index.ts --outdir ./dist --target bun

# Stage 2: Production stage
FROM oven/bun:latest
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=builder /usr/src/app ./
RUN bun build --entrypoints ./dist/index.js --outfile ./app --compile --sourcemap --target=bun-linux-x64-modern


USER bun
EXPOSE 5178/tcp
CMD [ "./app" ]
