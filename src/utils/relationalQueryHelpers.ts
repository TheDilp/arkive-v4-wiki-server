import { ExpressionBuilder } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { EntitiesWithTags, TagsRelationTables } from "../database/types";
import { newTagTables } from "../enums";

export function TagQuery(
  eb: ExpressionBuilder<any, any>,
  relationalTable: TagsRelationTables,
  table: EntitiesWithTags
) {
  let tag_query = eb.selectFrom(relationalTable);

  tag_query = tag_query
    .whereRef(
      `${table}.id`,
      "=",
      `${relationalTable}.${newTagTables.includes(relationalTable) ? "related_id" : "A"}`
    )
    .leftJoin(
      "tags",
      "tags.id",
      `${relationalTable}.${newTagTables.includes(relationalTable) ? "tag_id" : "B"}`
    )
    .where("tags.deleted_at", "is", null)
    .select(["tags.id", "tags.title", "tags.color"]);

  return jsonArrayFrom(tag_query).as("tags");
}
