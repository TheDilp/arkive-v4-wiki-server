# Stage 1: Build stage
FROM oven/bun:1.1.20 as builder
WORKDIR /usr/src/app
ENV HUSKY=0
ENV NODE_ENV=production
COPY . .
RUN bun install --production --force

FROM builder
WORKDIR /usr/src/app
ENV NODE_ENV=production
RUN bun build --entrypoints ./dist/index.js --outfile ./app --compile --sourcemap --target=bun-linux-x64-modern


USER bun
EXPOSE 5178/tcp
CMD [ "./app" ]
