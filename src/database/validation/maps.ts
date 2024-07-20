import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadMapSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    relations: t.Optional(
      t.Object({
        map_pins: t.Optional(t.Boolean()),
        map_layers: t.Optional(t.Boolean()),
        images: t.Optional(t.Boolean()),
        tags: t.Optional(t.Boolean()),
        children: t.Optional(t.Boolean()),
        parents: t.Optional(t.Boolean()),
      })
    ),
  }),
]);
