import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadProjectSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          roles: t.Optional(t.Boolean()),
          map_pin_types: t.Optional(t.Boolean()),
          character_relationship_types: t.Optional(t.Boolean()),
          members: t.Optional(t.Boolean()),
          feature_flags: t.Optional(t.Boolean()),
        })
      ),
    })
  ),
]);

export const ProjectListSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({
      auth_id: t.String(),
    }),
  }),
]);
