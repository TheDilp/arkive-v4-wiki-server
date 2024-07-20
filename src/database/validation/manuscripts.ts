import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

const ManuscriptEntitySchema = t.Object({
  parent_id: t.Union([t.Null(), t.String()]),
  manuscript_id: t.String(),
  document_id: t.Union([t.Null(), t.String()]),
  character_id: t.Union([t.Null(), t.String()]),
  blueprint_instance_id: t.Union([t.Null(), t.String()]),
  map_id: t.Union([t.Null(), t.String()]),
  map_pin_id: t.Union([t.Null(), t.String()]),
  graph_id: t.Union([t.Null(), t.String()]),
  event_id: t.Union([t.Null(), t.String()]),
  image_id: t.Union([t.Null(), t.String()]),
  sort: t.Number(),
});

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
