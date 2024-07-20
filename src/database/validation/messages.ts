import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadMessageSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ id: t.String() }) }),
  t.Optional(
    t.Object({ relations: t.Optional(t.Object({ character: t.Boolean() })) })
  ),
]);
export const ListMessagesSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ conversation_id: t.String() }) }),
]);
