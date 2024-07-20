import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListCharacterSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ project_id: t.String() }) }),
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          portrait: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
          is_favorite: t.Optional(t.Union([t.Boolean(), t.Null()])),
        })
      ),
    })
  ),
]);
export const ReadCharacterSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          portrait: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
          character_relationship_types: t.Optional(t.Boolean()),
          relationships: t.Optional(t.Boolean()),
          character_fields: t.Optional(t.Boolean()),
          documents: t.Optional(t.Boolean()),
          images: t.Optional(t.Boolean()),
          events: t.Optional(t.Boolean()),
          locations: t.Optional(t.Boolean()),
          is_favorite: t.Optional(t.Union([t.Boolean(), t.Null()])),
        })
      ),
    })
  ),
]);

export const GenerateCharacterRelationshipTreeSchema = t.Object({
  data: t.Object({
    direct_only: t.Optional(t.Boolean()),
  }),
});
