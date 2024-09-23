import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListManuscriptSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ project_id: t.String() }),
    relations: t.Optional(
      t.Object({
        tags: t.Optional(t.Boolean()),
        entities: t.Optional(t.Boolean()),
      })
    ),
  }),
]);

export const ReadManuscriptSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          tags: t.Optional(t.Boolean()),
          entities: t.Optional(t.Boolean()),
        })
      ),
    })
  ),
]);
