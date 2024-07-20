import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .onStart(() => console.info(`Listening on port ${process.env.PORT} 🚀`));

app.listen(process.env.PORT as string);
