import { Elysia } from "elysia";
import { single_entity_router } from "./src/routers/single_entity_router";
import cors from "@elysiajs/cors";
import { multiple_entity_router, search_router } from "./src/routers";
import { NoPublicAccess } from "./src/enums";

const app = new Elysia()
  .error({
    NO_PUBLIC_ACCESS: NoPublicAccess,
  })
  .onError(({ code, error, set }) => {
    if (code === "NO_PUBLIC_ACCESS") {
      set.status = 403;
      return { message: "NO_PUBLIC_ACCESS", ok: false, role_access: false };
    }
    if (code === "NOT_FOUND") {
      set.status = 404;
      return { message: "Route not found.", ok: false, role_access: false };
    }
    if (code === "INTERNAL_SERVER_ERROR") {
      set.status = 500;
      return {
        message: "There was an error with your request.",
        ok: false,
        role_access: false,
      };
    }
    if (code === "VALIDATION") {
      set.status = 400;
      console.error(error);
      return {
        message: "There was an error with your request.",
        ok: false,
        role_access: false,
      };
    }
    if (error?.message === "no result") {
      console.error(error);

      return {
        message:
          "This entity could not be found or you do not have permission to view it.",
        ok: true,
        role_access: false,
      };
    }
    console.error(error);
    return {
      message: "There was an error with your request.",
      ok: false,
      role_access: false,
    };
  })
  .get("/health_check", async () => "Ok")

  .use(
    cors({
      origin:
        process.env.NODE_ENV === "development"
          ? true
          : [process.env.WIKI_CLIENT_URL as string],
      methods: ["GET", "POST", "OPTIONS"],
    })
  )
  .use(single_entity_router)
  .use(multiple_entity_router)
  .use(search_router)

  .onStart(() => {
    console.info("WIKI CLIENT URL", process.env.WIKI_CLIENT_URL);
    console.info(`Listening on port ${process.env.PORT} 🚀`);
  });

app.listen(process.env.PORT as string);
