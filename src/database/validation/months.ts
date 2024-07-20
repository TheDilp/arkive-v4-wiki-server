import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListMonthSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ parent_id: t.String() }) }),
]);
