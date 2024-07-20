import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadRandomTableSchema = t.Intersect([
  RequestBodySchema,

  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          children: t.Optional(t.Boolean()),
          parents: t.Optional(t.Boolean()),
          random_table_options: t.Optional(t.Boolean()),
        })
      ),
    })
  ),
]);
