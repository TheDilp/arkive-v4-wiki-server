import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListMapPinTypeSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({
      project_id: t.String(),
    }),
  }),
]);
export const ReadMapPinTypeSchema = t.Object({
  data: t.Object({
    id: t.String(),
  }),
});
