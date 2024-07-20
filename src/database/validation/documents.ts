import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadDocumentSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          alter_names: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
          children: t.Optional(t.Boolean()),
          parents: t.Optional(t.Boolean()),
          image: t.Optional(t.Boolean()),
          template_fields: t.Optional(t.Boolean()),
        })
      ),
    })
  ),
]);
export const ListDocumentSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ project_id: t.String() }),
    relations: t.Optional(
      t.Object({
        tags: t.Optional(t.Boolean()),
        image: t.Optional(t.Boolean()),
      })
    ),
  }),
]);
