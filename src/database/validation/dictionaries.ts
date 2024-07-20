import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadDictionarySchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          words: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
          children: t.Optional(t.Boolean()),
          parents: t.Optional(t.Boolean()),
        })
      ),
    })
  ),
]);
