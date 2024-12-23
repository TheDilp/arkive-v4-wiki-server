import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadRandomTableOptionSchema = t.Intersect([RequestBodySchema]);

export const ListRandomTableOptionsSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ parent_id: t.String() }) }),
]);

export const ListRandomTableOptionsByParentSchema = t.Object({
  data: t.Object({ count: t.Number() }),
});

export const ListRandomTableOptionRandomManySchema = t.Object({
  data: t.Array(t.Object({ table_id: t.String(), count: t.Number() })),
});
