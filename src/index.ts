import { Elysia } from "elysia";
import { single_entity_router } from "./routers/single_entity_router";
import cors from "@elysiajs/cors";
import { multiple_entity_router } from "./routers";

const app = new Elysia()
  .use(single_entity_router)
  .use(multiple_entity_router)
  .use(
    cors({
      origin:
        process.env.NODE_ENV === "development"
          ? true
          : [process.env.WIKI_CLIENT_URL as string],
      methods: ["GET", "POST"],
    })
  )
  .onStart(() => console.info(`Listening on port ${process.env.PORT} 🚀`));

app.listen(process.env.PORT as string);
