import Elysia from "elysia";
import { MessageEnum } from "../enums";
import {
  EntityListSchema,
  ListCalendarSchema,
  ListCharacterFieldsTemplateSchema,
  ListCharacterSchema,
  ListDocumentSchema,
  ListWordSchema,
  PublicListBlueprintInstanceSchema,
} from "../database/validation";
import { ResponseWithDataSchema } from "../types";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import {
  constructFilter,
  constructOrdering,
  groupRelationFiltersByField,
  TagQuery,
  tagsRelationFilter,
} from "../utils";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";
import { db } from "../database/db";
import { getCharacterFamily } from "../database/queries";

export function multiple_entity_router(app: Elysia) {
  return app
    .post(
      "/character_fields_templates",
      async ({ body }) => {
        const data = await db
          .selectFrom("character_fields_templates")
          .distinctOn(
            body.orderBy?.length
              ? ([
                  "character_fields_templates.id",
                  ...body.orderBy.map((order) => order.field),
                ] as any)
              : "character_fields_templates.id"
          )
          .where(
            "character_fields_templates.project_id",
            "=",
            body.data.project_id
          )
          .select(
            (body.fields || [])?.map(
              (field) => `character_fields_templates.${field}`
            ) as SelectExpression<DB, "character_fields_templates">[]
          )
          .$if(
            !!body?.filters?.and?.length || !!body?.filters?.or?.length,
            (qb) => {
              qb = constructFilter(
                "character_fields_templates",
                qb,
                body.filters
              );
              return qb;
            }
          )
          .$if(
            !!body.relationFilters?.and?.length ||
              !!body.relationFilters?.or?.length,
            (qb) => {
              const { tags } = groupRelationFiltersByField(
                body.relationFilters || {}
              );
              if (tags?.filters?.length)
                qb = tagsRelationFilter(
                  "character_fields_templates",
                  "_character_fields_templatesTotags",
                  qb,
                  tags?.filters || []
                );

              return qb;
            }
          )

          .$if(!!body?.relations, (qb) => {
            if (body?.relations?.character_fields) {
              qb = qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("character_fields")
                    .whereRef(
                      "character_fields_templates.id",
                      "=",
                      "character_fields.parent_id"
                    )
                    .select([
                      "character_fields.id",
                      "character_fields.title",
                      "character_fields.field_type",
                      "character_fields.options",
                      "character_fields.sort",
                      "character_fields.formula",
                      "character_fields.random_table_id",
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("calendars")
                            .select([
                              "calendars.id",
                              "calendars.title",
                              "calendars.days",
                              (sb) =>
                                jsonArrayFrom(
                                  sb
                                    .selectFrom("months")
                                    .select([
                                      "months.id",
                                      "months.title",
                                      "months.days",
                                    ])
                                    .orderBy("months.sort")
                                    .whereRef(
                                      "months.parent_id",
                                      "=",
                                      "calendars.id"
                                    )
                                ).as("months"),
                            ])
                            .whereRef(
                              "calendars.id",
                              "=",
                              "character_fields.calendar_id"
                            )
                        ).as("calendar"),
                      (eb) =>
                        jsonObjectFrom(
                          eb
                            .selectFrom("random_tables")
                            .select([
                              "random_tables.id",
                              "random_tables.title",
                              (ebb) =>
                                jsonArrayFrom(
                                  ebb
                                    .selectFrom("random_table_options")
                                    .whereRef(
                                      "random_tables.id",
                                      "=",
                                      "random_table_options.parent_id"
                                    )
                                    .select([
                                      "id",
                                      "title",
                                      (ebbb) =>
                                        jsonArrayFrom(
                                          ebbb
                                            .selectFrom(
                                              "random_table_suboptions"
                                            )
                                            .whereRef(
                                              "random_table_suboptions.parent_id",
                                              "=",
                                              "random_table_options.id"
                                            )
                                            .select(["id", "title"])
                                        ).as("random_table_suboptions"),
                                    ])
                                ).as("random_table_options"),
                            ])
                            .whereRef(
                              "random_tables.id",
                              "=",
                              "character_fields.random_table_id"
                            )
                        ).as("random_table"),
                    ])
                    .orderBy(["character_fields.sort"])
                ).as("character_fields")
              );
            }

            return qb;
          })
          .execute();
        return {
          data,
          message: MessageEnum.success,
          ok: true,
          role_access: true,
        };
      },
      {
        body: ListCharacterFieldsTemplateSchema,
        response: ResponseWithDataSchema,
      }
    )

    .post(
      "/events",
      async ({ body }) => {
        const data = await db
          .selectFrom("events")

          .$if(!body.fields?.length, (qb) => qb.selectAll())
          .$if(!!body.fields?.length, (qb) =>
            qb
              .clearSelect()
              .select(
                body.fields.map((f) => `events.${f}`) as SelectExpression<
                  DB,
                  "events"
                >[]
              )
          )
          .$if(
            !!body?.filters?.and?.length || !!body?.filters?.or?.length,
            (qb) => {
              qb = constructFilter("events", qb, body.filters);
              return qb;
            }
          )
          .$if(!!body.orderBy?.length, (qb) => {
            qb = constructOrdering(body.orderBy, qb);
            return qb;
          })
          .leftJoin("months as sm", "events.start_month_id", "sm.id")
          .leftJoin("months as em", "events.end_month_id", "em.id")
          .select(["sm.sort as start_month", "em.sort as end_month"])
          .where("events.is_public", "=", true)
          .execute();

        return {
          data,
          message: MessageEnum.success,
          ok: true,
          role_access: true,
        };
      },
      {
        body: EntityListSchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/characters",
      async ({ body }) => {
        const result = db
          .selectFrom("characters")
          .select(
            body.fields.map(
              (field) => `characters.${field}`
            ) as SelectExpression<DB, "characters">[]
          )
          .distinctOn(
            body.orderBy?.length
              ? ([
                  "characters.id",
                  ...body.orderBy.map((order) => order.field),
                ] as any)
              : "characters.id"
          )
          .where("characters.project_id", "=", body?.data?.project_id)
          .where("characters.is_public", "=", true)
          .limit(body?.pagination?.limit || 10)
          .offset(
            (body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10)
          )

          .$if(
            !!body?.filters?.and?.length || !!body?.filters?.or?.length,
            (qb) => {
              qb = constructFilter("characters", qb, body.filters);
              return qb;
            }
          )
          .$if(!!body.orderBy?.length, (qb) =>
            constructOrdering(body.orderBy, qb)
          )
          .$if(!!body?.relations, (qb) => {
            if (body?.relations?.portrait) {
              qb = qb.select((eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom("images")
                    .whereRef("images.id", "=", "characters.portrait_id")
                    .select(["images.id", "images.title"])
                ).as("portrait")
              );
            }
            if (body?.relations?.tags) {
              qb = qb.select((eb) =>
                TagQuery(eb, "_charactersTotags", "characters")
              );
            }
            return qb;
          });
        const data = await result.execute();

        return {
          data,
          message: MessageEnum.success,
          ok: true,
          role_access: true,
        };
      },
      {
        body: ListCharacterSchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/blueprints",
      async ({ body }) => {
        const query = db
          .selectFrom("blueprint_instances")
          .select(
            body.fields.map(
              (field) => `blueprint_instances.${field}`
            ) as SelectExpression<DB, "blueprint_instances">[]
          )
          .$if(!!body.orderBy?.length, (qb) => {
            qb = constructOrdering(body.orderBy, qb);
            return qb;
          })
          .leftJoin(
            "blueprints",
            "blueprints.id",
            "blueprint_instances.parent_id"
          )
          .select(["blueprints.icon"])
          .where("blueprints.project_id", "=", body.data.project_id)
          .where("blueprint_instances.is_public", "=", true);

        const data = await query.execute();
        return {
          data,
          message: MessageEnum.success,
          ok: true,
          role_access: true,
        };
      },
      {
        body: PublicListBlueprintInstanceSchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/documents",
      async ({ body }) => {
        const data = await db
          .selectFrom("documents")
          .where("documents.project_id", "=", body?.data?.project_id)
          .where("documents.is_public", "=", true)
          .where((wb) =>
            wb.or([wb("is_folder", "=", false), wb("is_folder", "is", null)])
          )
          .select(body.fields as SelectExpression<DB, "documents">[])
          .$if(
            !!body?.filters?.and?.length || !!body?.filters?.or?.length,
            (qb) => {
              qb = constructFilter("documents", qb, body.filters);
              return qb;
            }
          )
          .$if(!!body.relations?.tags, (qb) => {
            if (body?.relations?.tags) {
              return qb.select((eb) =>
                TagQuery(eb, "_documentsTotags", "documents")
              );
            }
            return qb;
          })
          .$if(!!body.orderBy, (qb) => constructOrdering(body.orderBy, qb))
          .execute();
        return {
          data,
          message: MessageEnum.success,
          ok: true,
          role_access: true,
        };
      },
      {
        body: ListDocumentSchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/maps",
      async ({ body }) => {
        const data = await db
          .selectFrom("maps")
          .where("project_id", "=", body.data.project_id)
          .where("is_public", "=", true)
          .where((wb) =>
            wb.or([wb("is_folder", "=", false), wb("is_folder", "is", null)])
          )
          .select(body.fields as SelectExpression<DB, "maps">[])
          .$if(!!body?.relations?.tags, (qb) =>
            qb.select((eb) => TagQuery(eb, "_mapsTotags", "maps"))
          )
          .$if(
            !!body?.filters?.and?.length || !!body?.filters?.or?.length,
            (qb) => {
              qb = constructFilter("maps", qb, body.filters);
              return qb;
            }
          )
          .execute();
        return {
          data,
          message: MessageEnum.success,
          ok: true,
          role_access: true,
        };
      },
      {
        body: EntityListSchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/graphs",
      async ({ body }) => {
        const data = await db
          .selectFrom("graphs")
          .where("project_id", "=", body.data.project_id)
          .where("is_public", "=", true)
          .where((wb) =>
            wb.or([wb("is_folder", "=", false), wb("is_folder", "is", null)])
          )
          .select(body.fields as SelectExpression<DB, "graphs">[])
          .$if(
            !!body?.filters?.and?.length || !!body?.filters?.or?.length,
            (qb) => {
              qb = constructFilter("graphs", qb, body.filters);
              return qb;
            }
          )
          .limit(body?.pagination?.limit || 10)
          .offset(
            (body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10)
          )
          .$if(!!body.orderBy?.length, (qb) => {
            qb = constructOrdering(body.orderBy, qb);
            return qb;
          })
          .execute();
        return {
          data,
          message: MessageEnum.success,
          ok: true,
          role_access: true,
        };
      },
      {
        body: EntityListSchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/calendars",
      async ({ body }) => {
        const data = await db
          .selectFrom("calendars")
          .where("calendars.project_id", "=", body?.data?.project_id)
          .where("calendars.is_public", "=", true)
          .where((wb) =>
            wb.or([wb("is_folder", "=", false), wb("is_folder", "is", null)])
          )
          .select(body.fields as SelectExpression<DB, "calendars">[])
          .$if(
            !!body?.filters?.and?.length || !!body?.filters?.or?.length,
            (qb) => {
              qb = constructFilter("calendars", qb, body.filters);
              return qb;
            }
          )
          .execute();

        return {
          data,
          message: MessageEnum.success,
          ok: true,
          role_access: true,
        };
      },
      {
        body: ListCalendarSchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/dictionaries",
      async ({ body }) => {
        const data = await db
          .selectFrom("dictionaries")
          .limit(body?.pagination?.limit || 10)
          .offset(
            (body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10)
          )
          .where("project_id", "=", body.data.project_id)
          .where("is_public", "=", true)
          .where((wb) =>
            wb.or([wb("is_folder", "=", false), wb("is_folder", "is", null)])
          )
          .select(body.fields as SelectExpression<DB, "dictionaries">[])
          .$if(!!body.orderBy?.length, (qb) => {
            qb = constructOrdering(body.orderBy, qb);
            return qb;
          })
          .$if(
            !!body?.filters?.and?.length || !!body?.filters?.or?.length,
            (qb) => {
              qb = constructFilter("dictionaries", qb, body.filters);
              return qb;
            }
          )
          .execute();

        return {
          data,
          message: MessageEnum.success,
          ok: true,
          role_access: true,
        };
      },
      {
        body: EntityListSchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/words",
      async ({ body }) => {
        const data = await db
          .selectFrom("words")
          .limit(body?.pagination?.limit || 10)
          .offset(
            (body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10)
          )
          .select(
            body.fields.map((f) => `words.${f}`) as SelectExpression<
              DB,
              "words"
            >[]
          )
          .$if(!!body.orderBy?.length, (qb) => {
            qb = constructOrdering(body.orderBy, qb);
            return qb;
          })
          .$if(
            !!body?.filters?.and?.length || !!body?.filters?.or?.length,
            (qb) => {
              qb = constructFilter("words", qb, body.filters);
              return qb;
            }
          )
          .where("words.parent_id", "=", body.data.parent_id)
          .leftJoin("dictionaries", "dictionaries.id", "words.parent_id")
          .where("dictionaries.is_public", "=", true)
          .where("words.is_public", "=", true)
          .execute();
        return {
          data,
          ok: true,
          role_access: true,
          message: MessageEnum.success,
        };
      },
      {
        body: ListWordSchema,
        response: ResponseWithDataSchema,
      }
    )

    .get(
      "/characters/family/:relation_type_id/:id/:count",
      async ({ params }) => getCharacterFamily(params, {}, true),
      {
        response: ResponseWithDataSchema,
      }
    );
}
