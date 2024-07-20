import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListCharacterRelationshipTypeSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ project_id: t.String() }) }),
]);
