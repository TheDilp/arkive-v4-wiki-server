import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadConversationSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ id: t.String() }),
  }),
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          characters: t.Optional(t.Boolean()),
          messages: t.Optional(t.Boolean()),
        })
      ),
    })
  ),
]);
export const ListConversationSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ character_id: t.String(), project_id: t.String() }),
  }),
  t.Object({
    relations: t.Object({
      characters: t.Optional(t.Boolean()),
      messages: t.Optional(t.Boolean()),
    }),
  }),
]);
