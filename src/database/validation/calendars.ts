import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadCalendarSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          eras: t.Optional(t.Boolean()),
          leap_days: t.Optional(t.Boolean()),
          months: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
          parents: t.Optional(t.Boolean()),
          children: t.Optional(t.Boolean()),
        })
      ),
    })
  ),
]);
export const ListCalendarSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ project_id: t.String() }),
    relations: t.Optional(t.Object({ tags: t.Optional(t.Boolean()) })),
  }),
]);
