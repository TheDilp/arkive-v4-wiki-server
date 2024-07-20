import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListAssetsSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    relations: t.Optional(t.Object({ tags: t.Optional(t.Boolean()) })),
  }),
]);
export const ReadAssetsSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    relations: t.Optional(t.Object({ tags: t.Optional(t.Boolean()) })),
  }),
]);
