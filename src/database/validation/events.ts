import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadEventSchema = t.Intersect([
  RequestBodySchema,

  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          tags: t.Optional(t.Boolean()),
          image: t.Optional(t.Boolean()),
          document: t.Optional(t.Boolean()),
          characters: t.Optional(t.Boolean()),
          map_pins: t.Optional(t.Boolean()),
        })
      ),
    })
  ),
]);

export const ListEventSchema = t.Intersect([
  RequestBodySchema,

  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          tags: t.Optional(t.Boolean()),
          document: t.Optional(t.Boolean()),
          characters: t.Optional(t.Boolean()),
          map_pins: t.Optional(t.Boolean()),
        })
      ),
    })
  ),
]);
