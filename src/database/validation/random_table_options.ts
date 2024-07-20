import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadRandomTableOptionSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          random_table_suboptions: t.Optional(t.Boolean()),
        })
      ),
    })
  ),
]);

export const ListRandomTableOptionsSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ parent_id: t.String() }) }),
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({ random_table_suboptions: t.Optional(t.Boolean()) })
      ),
    })
  ),
]);

export const ListRandomTableOptionsByParentSchema = t.Object({
  data: t.Object({ count: t.Number() }),
});

export const ListRandomTableOptionRandomManySchema = t.Object({
  data: t.Array(t.Object({ table_id: t.String(), count: t.Number() })),
});

export const RandomTableSubOptionSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.Optional(t.Union([t.String(), t.Null()])),
  parent_id: t.String(),
});
