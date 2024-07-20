import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListCharacterFieldsTemplateSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ project_id: t.String() }),
  }),
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          character_fields: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
        })
      ),
    })
  ),
]);

export const ReadCharacterFieldsTemplateSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ id: t.String() }),
    relations: t.Object({
      character_fields: t.Optional(t.Boolean()),
      tags: t.Optional(t.Boolean()),
    }),
  }),
]);
