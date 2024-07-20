import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListMapPinSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(t.Object({ character: t.Optional(t.Boolean()) })),
    })
  ),
]);
export const ReadMapPinSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(t.Object({ events: t.Optional(t.Boolean()) })),
    })
  ),
]);
