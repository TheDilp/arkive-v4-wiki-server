import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListWordSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ parent_id: t.String() }) }),
]);

export const ReadWordSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ id: t.String() }) }),
]);
