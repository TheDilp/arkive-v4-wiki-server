# Stage 1: Build stage
FROM oven/bun:1.1.20 AS base
WORKDIR /usr/src/app
ENV HUSKY=0
ENV NODE_ENV=production
COPY . .
RUN bun install --production --force

FROM oven/bun:1.1.20
WORKDIR /usr/src/app
COPY --from=base /usr/src/app ./
ENV NODE_ENV=production
RUN bun build --entrypoints ./ --outfile ./app --compile --sourcemap --target=bun-linux-x64-modern

USER bun
EXPOSE 5178/tcp
CMD [ "./app" ]
