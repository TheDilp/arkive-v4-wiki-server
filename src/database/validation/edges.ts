import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadEdgeSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    relations: t.Optional(
      t.Object({
        tags: t.Optional(t.Boolean()),
      })
    ),
  }),
]);
export const ListEdgesSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ parent_id: t.String() }) }),
]);
