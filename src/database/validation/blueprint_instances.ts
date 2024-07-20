import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListBlueprintInstanceSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ parent_id: t.Optional(t.String()) }),
  }),
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          blueprint_fields: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
        })
      ),
    })
  ),
]);
export const PublicListBlueprintInstanceSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ project_id: t.String() }),
  }),
]);

export const ReadBlueprintInstanceSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ id: t.String() }),
    relations: t.Optional(
      t.Object({
        blueprint_fields: t.Optional(t.Boolean()),
        tags: t.Optional(t.Boolean()),
      })
    ),
  }),
]);
