import Elysia, { t } from "elysia";
import { SelectExpression, sql } from "kysely";
import { DB } from "kysely-codegen";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { db } from "../database/db";
import { readCharacter } from "../database/queries";
import {
  ReadBlueprintSchema,
  ReadCalendarSchema,
  ReadCharacterSchema,
  ReadDictionarySchema,
  ReadDocumentSchema,
  ReadEventSchema,
  ReadGraphSchema,
  ReadMapSchema,
  ReadWordSchema,
} from "../database/validation";
import { MessageEnum } from "../enums";
import {
  RequestBodySchema,
  ResponseSchema,
  ResponseWithDataSchema,
} from "../types";
import { ReadManuscriptSchema } from "../database/validation/manuscripts";

export function single_entity_router(app: Elysia) {
  return app

    .post(
      "/projects/:id",
      async ({ params, body }) => {
        const data = await db
          .selectFrom("projects")
          .where("id", "=", params.id)
          .$if(!body?.fields?.length, (qb) => qb.selectAll())
          .select(body.fields as SelectExpression<DB, "projects">[])
          .executeTakeFirstOrThrow();
        return {
          data,
          message: MessageEnum.success,
          ok: true,
        };
      },
      {
        body: ReadDocumentSchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/manuscripts/:id",
      async ({ params, body }) => {
        let query = db
          .selectFrom("manuscripts")
          .select(body.fields as SelectExpression<DB, "manuscripts">[])
          .where("manuscripts.id", "=", params.id)
          .where("is_public", "=", true);
        if (body?.relations?.entities) {
          query = query.select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("manuscript_characters")
                .leftJoin(
                  "characters",
                  "characters.id",
                  "manuscript_characters.related_id"
                )
                .where("manuscript_characters.parent_id", "=", params.id)
                .where("characters.is_public", "=", true)
                .select([
                  "manuscript_characters.id",
                  "manuscript_characters.parent_id",
                  "manuscript_characters.related_id",
                  "manuscript_characters.sort",
                  "characters.full_name as title",
                  "characters.portrait_id as image_id",
                  sql`'characters'::TEXT`.as("type"),
                ])
            ).as("characters")
          );
          query = query.select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("manuscript_blueprint_instances")
                .leftJoin(
                  "blueprint_instances",
                  "blueprint_instances.id",
                  "manuscript_blueprint_instances.related_id"
                )
                .leftJoin(
                  "blueprints",
                  "blueprints.id",
                  "blueprint_instances.parent_id"
                )
                .where(
                  "manuscript_blueprint_instances.parent_id",
                  "=",
                  params.id
                )
                .where("blueprint_instances.is_public", "=", true)

                .select([
                  "manuscript_blueprint_instances.id",
                  "manuscript_blueprint_instances.parent_id",
                  "manuscript_blueprint_instances.related_id",
                  "manuscript_blueprint_instances.sort",
                  "blueprint_instances.title",
                  "blueprints.icon",
                  sql`'blueprint_instances'::TEXT`.as("type"),
                ])
            ).as("blueprint_instances")
          );
          query = query.select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("manuscript_documents")
                .leftJoin(
                  "documents",
                  "documents.id",
                  "manuscript_documents.related_id"
                )
                .where("manuscript_documents.parent_id", "=", params.id)
                .where("documents.is_public", "=", true)
                .select([
                  "manuscript_documents.id",
                  "manuscript_documents.parent_id",
                  "manuscript_documents.related_id",
                  "manuscript_documents.sort",
                  "documents.title",
                  "documents.icon",
                  "documents.image_id",
                  sql`'documents'::TEXT`.as("type"),
                ])
            ).as("documents")
          );
          query = query.select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("manuscript_maps")
                .leftJoin("maps", "maps.id", "manuscript_maps.related_id")
                .where("manuscript_maps.parent_id", "=", params.id)
                .where("maps.is_public", "=", true)
                .select([
                  "manuscript_maps.id",
                  "manuscript_maps.parent_id",
                  "manuscript_maps.related_id",
                  "manuscript_maps.sort",
                  "maps.title",
                  "maps.icon",
                  "maps.image_id",
                  sql`'maps'::TEXT`.as("type"),
                ])
            ).as("maps")
          );
          query = query.select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("manuscript_map_pins")
                .leftJoin(
                  "map_pins",
                  "map_pins.id",
                  "manuscript_map_pins.related_id"
                )
                .where("manuscript_map_pins.parent_id", "=", params.id)
                .where("map_pins.is_public", "=", true)
                .select([
                  "manuscript_map_pins.id",
                  "manuscript_map_pins.parent_id",
                  "manuscript_map_pins.related_id",
                  "manuscript_map_pins.sort",
                  "map_pins.title",
                  "map_pins.icon",
                  "map_pins.image_id",
                  sql`'map_pins'::TEXT`.as("type"),
                ])
            ).as("map_pins")
          );
          query = query.select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("manuscript_graphs")
                .leftJoin("graphs", "graphs.id", "manuscript_graphs.related_id")
                .where("manuscript_graphs.parent_id", "=", params.id)
                .where("graphs.is_public", "=", true)
                .select([
                  "manuscript_graphs.id",
                  "manuscript_graphs.parent_id",
                  "manuscript_graphs.related_id",
                  "manuscript_graphs.sort",
                  "graphs.title",
                  "graphs.icon",
                  sql`'graphs'::TEXT`.as("type"),
                ])
            ).as("graphs")
          );

          query = query.select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("manuscript_events")
                .leftJoin("events", "events.id", "manuscript_events.related_id")
                .where("manuscript_events.parent_id", "=", params.id)
                .where("events.is_public", "=", true)
                .select([
                  "manuscript_events.id",
                  "manuscript_events.parent_id",
                  "manuscript_events.related_id",
                  "manuscript_events.sort",
                  "events.title",
                  "events.image_id",
                  sql`'events'::TEXT`.as("type"),
                ])
            ).as("events")
          );
          query = query.select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("manuscript_images")
                .leftJoin("images", "images.id", "manuscript_images.related_id")
                .where("manuscript_images.parent_id", "=", params.id)
                .where("images.is_public", "=", true)
                .select([
                  "manuscript_images.id",
                  "manuscript_images.parent_id",
                  "manuscript_images.related_id",
                  "manuscript_images.sort",
                  "images.title",

                  sql`'images'::TEXT`.as("type"),
                ])
            ).as("images")
          );
        }

        const data = await query.executeTakeFirstOrThrow();

        return { data, ok: true, message: "Succcess." };
      },
      {
        body: ReadManuscriptSchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/blueprints/:id",
      async ({ params, body }) => {
        const data = await db
          .selectFrom("blueprints")
          .select(body.fields as SelectExpression<DB, "blueprints">[])
          .where("blueprints.id", "=", params.id)
          .$if(!!body?.relations?.blueprint_fields, (qb) =>
            qb.select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("blueprint_fields")
                  .whereRef("blueprint_fields.parent_id", "=", "blueprints.id")
                  .select([
                    "blueprint_fields.id",
                    "blueprint_fields.title",
                    "blueprint_fields.options",
                    "blueprint_fields.field_type",
                    "blueprint_fields.sort",
                    "blueprint_fields.formula",
                    "blueprint_fields.random_table_id",
                    "blueprint_fields.blueprint_id",
                    (eb) =>
                      jsonObjectFrom(
                        eb
                          .selectFrom("blueprints")
                          .whereRef(
                            "blueprints.id",
                            "=",
                            "blueprint_fields.blueprint_id"
                          )
                          .select(["id", "title", "icon"])
                      ).as("blueprint"),
                    (eb) =>
                      jsonObjectFrom(
                        eb
                          .selectFrom("random_tables")
                          .whereRef(
                            "blueprint_fields.random_table_id",
                            "=",
                            "random_tables.id"
                          )
                          .select([
                            "id",
                            "title",
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
                                          .selectFrom("random_table_suboptions")
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
                      ).as("random_table"),
                    (eb) =>
                      jsonObjectFrom(
                        eb
                          .selectFrom("calendars")
                          .whereRef(
                            "blueprint_fields.calendar_id",
                            "=",
                            "calendars.id"
                          )
                          .select([
                            "id",
                            "title",
                            "days",
                            (ebb) =>
                              jsonArrayFrom(
                                ebb
                                  .selectFrom("months")
                                  .whereRef(
                                    "calendars.id",
                                    "=",
                                    "months.parent_id"
                                  )
                                  .select([
                                    "months.id",
                                    "months.title",
                                    "months.days",
                                  ])
                                  .orderBy("months.sort")
                              ).as("months"),
                          ])
                      ).as("calendar"),
                  ])
                  .orderBy("sort")
              ).as("blueprint_fields")
            )
          )
          .$if(!!body?.relations?.blueprint_instances, (qb) =>
            qb.select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("blueprint_instances")
                  .whereRef(
                    "blueprint_instances.parent_id",
                    "=",
                    "blueprints.id"
                  )
                  .select([
                    "blueprint_instances.id",
                    "blueprint_instances.parent_id",
                  ])
              ).as("blueprint_instances")
            )
          )

          .executeTakeFirstOrThrow();
        return {
          data,
          message: MessageEnum.success,
          ok: true,
        };
      },
      {
        body: ReadBlueprintSchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/blueprint_instances/:id",
      async ({ params, body }) => {
        const data = await db
          .selectFrom("blueprint_instances")
          .select([
            ...(body.fields as SelectExpression<DB, "blueprint_instances">[]),
            (eb) =>
              jsonObjectFrom(
                eb
                  .selectFrom("blueprints")
                  .whereRef(
                    "blueprints.id",
                    "=",
                    "blueprint_instances.parent_id"
                  )
                  .select(["title", "title_name"])
              ).as("blueprint"),

            (eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("blueprint_fields")
                  .whereRef(
                    "blueprint_fields.parent_id",
                    "=",
                    "blueprint_instances.parent_id"
                  )
                  .select([
                    "id",
                    "field_type",
                    "sort",
                    (ebb) =>
                      jsonObjectFrom(
                        ebb
                          .selectFrom("random_tables")
                          .whereRef(
                            "random_tables.id",
                            "=",
                            "blueprint_fields.random_table_id"
                          )
                          .select(["id", "title"])
                      ).as("random_table_data"),
                    (ebb) =>
                      jsonArrayFrom(
                        ebb
                          .selectFrom("blueprint_instance_characters")
                          .whereRef(
                            "blueprint_instance_characters.blueprint_field_id",
                            "=",
                            "blueprint_fields.id"
                          )
                          .where(
                            "blueprint_instance_characters.blueprint_instance_id",
                            "=",
                            params.id
                          )
                          .select([
                            "related_id",
                            (ebbb) =>
                              jsonObjectFrom(
                                ebbb
                                  .selectFrom("characters")
                                  .whereRef("related_id", "=", "characters.id")
                                  .where("characters.is_public", "=", true)
                                  .select(["id", "full_name", "portrait_id"])
                              ).as("character"),
                          ])
                      ).as("characters"),
                    (ebb) =>
                      jsonArrayFrom(
                        ebb
                          .selectFrom("blueprint_instance_blueprint_instances")
                          .whereRef(
                            "blueprint_instance_blueprint_instances.blueprint_field_id",
                            "=",
                            "blueprint_fields.id"
                          )
                          .where(
                            "blueprint_instance_blueprint_instances.blueprint_instance_id",
                            "=",
                            params.id
                          )
                          .select([
                            "related_id",
                            (ebbb) =>
                              jsonObjectFrom(
                                ebbb
                                  .selectFrom("blueprint_instances")
                                  .whereRef(
                                    "related_id",
                                    "=",
                                    "blueprint_instances.id"
                                  )
                                  .where(
                                    "blueprint_instances.is_public",
                                    "=",
                                    true
                                  )
                                  .leftJoin(
                                    "blueprints",
                                    "blueprints.id",
                                    "blueprint_instances.parent_id"
                                  )
                                  .select([
                                    "blueprint_instances.id",
                                    "blueprint_instances.title",
                                    "blueprints.icon as icon",
                                    "blueprint_instances.parent_id",
                                  ])
                              ).as("blueprint_instance"),
                          ])
                      ).as("blueprint_instances"),
                    (ebb) =>
                      jsonArrayFrom(
                        ebb
                          .selectFrom("blueprint_instance_documents")
                          .whereRef(
                            "blueprint_instance_documents.blueprint_field_id",
                            "=",
                            "blueprint_fields.id"
                          )
                          .where(
                            "blueprint_instance_documents.blueprint_instance_id",
                            "=",
                            params.id
                          )
                          .select([
                            "related_id",
                            (ebbb) =>
                              jsonObjectFrom(
                                ebbb
                                  .selectFrom("documents")
                                  .whereRef("related_id", "=", "documents.id")
                                  .where("documents.is_public", "=", true)
                                  .select(["id", "title", "icon"])
                              ).as("document"),
                          ])
                      ).as("documents"),
                    (ebb) =>
                      jsonArrayFrom(
                        ebb
                          .selectFrom("blueprint_instance_map_pins")
                          .whereRef(
                            "blueprint_instance_map_pins.blueprint_field_id",
                            "=",
                            "blueprint_fields.id"
                          )
                          .where(
                            "blueprint_instance_map_pins.blueprint_instance_id",
                            "=",
                            params.id
                          )
                          .select([
                            "related_id",
                            (ebbb) =>
                              jsonObjectFrom(
                                ebbb
                                  .selectFrom("map_pins")
                                  .whereRef("related_id", "=", "map_pins.id")
                                  .where("map_pins.is_public", "=", true)
                                  .select(["id", "title", "icon", "parent_id"])
                              ).as("map_pin"),
                          ])
                      ).as("map_pins"),
                    (ebb) =>
                      jsonArrayFrom(
                        ebb
                          .selectFrom("blueprint_instance_events")
                          .whereRef(
                            "blueprint_instance_events.blueprint_field_id",
                            "=",
                            "blueprint_fields.id"
                          )
                          .where(
                            "blueprint_instance_events.blueprint_instance_id",
                            "=",
                            params.id
                          )
                          .select([
                            "related_id",
                            (ebbb) =>
                              jsonObjectFrom(
                                ebbb
                                  .selectFrom("events")
                                  .whereRef("related_id", "=", "events.id")
                                  .where("events.is_public", "=", true)
                                  .select(["id", "title", "parent_id"])
                              ).as("event"),
                          ])
                      ).as("events"),
                    (ebb) =>
                      jsonObjectFrom(
                        ebb
                          .selectFrom("blueprint_instance_random_tables")
                          .whereRef(
                            "blueprint_instance_random_tables.blueprint_field_id",
                            "=",
                            "blueprint_fields.id"
                          )
                          .where(
                            "blueprint_instance_random_tables.blueprint_instance_id",
                            "=",
                            params.id
                          )
                          .select(["related_id", "option_id", "suboption_id"])
                      ).as("random_table"),
                    (ebb) =>
                      jsonObjectFrom(
                        ebb
                          .selectFrom("blueprint_instance_calendars")
                          .whereRef(
                            "blueprint_instance_calendars.blueprint_field_id",
                            "=",
                            "blueprint_fields.id"
                          )
                          .where(
                            "blueprint_instance_calendars.blueprint_instance_id",
                            "=",
                            params.id
                          )
                          .select([
                            "related_id",
                            "start_day",
                            "start_month_id",
                            "start_year",
                            "end_day",
                            "end_month_id",
                            "end_year",
                          ])
                      ).as("calendar"),
                    (ebb) =>
                      jsonArrayFrom(
                        ebb
                          .selectFrom("blueprint_instance_images")
                          .whereRef(
                            "blueprint_instance_images.blueprint_field_id",
                            "=",
                            "blueprint_fields.id"
                          )
                          .where(
                            "blueprint_instance_images.blueprint_instance_id",
                            "=",
                            params.id
                          )
                          .select([
                            "related_id",
                            (ebbb) =>
                              jsonObjectFrom(
                                ebbb
                                  .selectFrom("images")
                                  .whereRef("related_id", "=", "images.id")
                                  .select(["id", "title"])
                                  .where("images.is_public", "=", true)
                              ).as("image"),
                          ])
                      ).as("images"),
                    (ebb) =>
                      ebb
                        .selectFrom("blueprint_instance_value")
                        .whereRef(
                          "blueprint_instance_value.blueprint_field_id",
                          "=",
                          "blueprint_fields.id"
                        )
                        .where(
                          "blueprint_instance_value.blueprint_instance_id",
                          "=",
                          params.id
                        )
                        .select(["value"])
                        .as("value"),
                  ])
              ).as("blueprint_fields"),

            (eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("tags")
                  .leftJoin(
                    "_blueprint_instancesTotags",
                    "_blueprint_instancesTotags.B",
                    "tags.id"
                  )
                  .select(["tags.id", "tags.title", "tags.color"])
                  .where("_blueprint_instancesTotags.A", "=", params.id)
              ).as("tags"),
          ])
          .where("blueprint_instances.id", "=", params.id)
          .where("blueprint_instances.is_public", "=", true)
          .executeTakeFirst();

        if (data?.is_public)
          return {
            data,
            message: MessageEnum.success,
            ok: true,
          };
        return {
          data: { is_public: false },
          message: MessageEnum.success,
          ok: true,
        };
      },
      {
        body: ReadCharacterSchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/characters/:id",
      async ({ params, body }) => readCharacter(body, params, {}, true),
      {
        body: ReadCharacterSchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/documents/:id",
      async ({ params, body }) => {
        const data = await db
          .selectFrom("documents")
          .where("id", "=", params.id)
          .where("is_public", "=", true)
          .select(body.fields as SelectExpression<DB, "documents">[])
          .executeTakeFirst();
        if (data?.is_public)
          return {
            data,
            message: MessageEnum.success,
            ok: true,
          };

        return {
          data: { is_public: false },
          message: MessageEnum.success,
          ok: true,
        };
      },
      {
        body: ReadDocumentSchema,
        response: t.Union([ResponseWithDataSchema, ResponseSchema]),
      }
    )
    .post(
      "/maps/:id",
      async ({ params, body }) => {
        const data = await db
          .selectFrom("maps")
          .select(body.fields as SelectExpression<DB, "maps">[])
          .where("maps.id", "=", params.id)
          .where("maps.is_public", "=", true)
          .$if(!!body?.relations?.map_pins, (qb) =>
            qb.select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("map_pins")
                  .select([
                    "map_pins.id",
                    "map_pins.background_color",
                    "map_pins.border_color",
                    "map_pins.color",
                    "map_pins.character_id",
                    "map_pins.doc_id",
                    "map_pins.icon",
                    "map_pins.title",
                    "map_pins.parent_id",
                    "map_pins.is_public",
                    "map_pins.lat",
                    "map_pins.lng",
                    "map_pins.map_link",
                    "map_pins.show_background",
                    "map_pins.show_border",
                    "map_pins.map_pin_type_id",
                    (eb) =>
                      jsonObjectFrom(
                        eb
                          .selectFrom("characters")
                          .whereRef(
                            "characters.id",
                            "=",
                            "map_pins.character_id"
                          )
                          .select(["id", "full_name", "portrait_id"])
                      ).as("character"),
                  ])
                  .whereRef("map_pins.parent_id", "=", "maps.id")
                  .where("map_pins.is_public", "=", true)
              ).as("map_pins")
            )
          )
          .$if(!!body?.relations?.map_layers, (qb) =>
            qb.select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("map_layers")
                  .select([
                    "map_layers.id",
                    "map_layers.title",
                    "map_layers.image_id",
                    "map_layers.is_public",
                    "map_layers.parent_id",
                    (eb) =>
                      jsonObjectFrom(
                        eb
                          .selectFrom("images")
                          .whereRef("images.id", "=", "map_layers.image_id")
                          .select(["images.id", "images.title"])
                      ).as("image"),
                  ])
                  .whereRef("map_layers.parent_id", "=", "maps.id")
                  .where("map_layers.is_public", "=", true)
              ).as("map_layers")
            )
          )
          .executeTakeFirst();
        if (data?.is_public)
          return {
            data,
            message: MessageEnum.success,
            ok: true,
          };
        return {
          data: { is_public: false },
          message: MessageEnum.success,
          ok: true,
        };
      },
      {
        body: ReadMapSchema,
        response: t.Union([ResponseWithDataSchema, ResponseSchema]),
      }
    )
    .post(
      "/graphs/:id",
      async ({ params, body }) => {
        const data = await db

          .selectFrom("graphs")
          .where("graphs.id", "=", params.id)
          .where("graphs.is_public", "=", true)
          .select(body.fields as SelectExpression<DB, "graphs">[])
          .$if(!!body?.relations?.nodes, (qb) =>
            qb.select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("nodes")
                  .where("nodes.parent_id", "=", params.id)
                  .select((sb) => [
                    "nodes.id",
                    "nodes.label",
                    "nodes.icon",
                    "nodes.background_color",
                    "nodes.background_opacity",
                    "nodes.font_color",
                    "nodes.font_family",
                    "nodes.font_size",
                    "nodes.type",
                    "nodes.image_id",
                    "nodes.text_h_align",
                    "nodes.text_v_align",
                    "nodes.x",
                    "nodes.y",
                    "nodes.z_index",
                    "nodes.width",
                    "nodes.height",
                    "nodes.is_locked",
                    jsonObjectFrom(
                      sb
                        .selectFrom("characters")
                        .select([
                          "characters.first_name",
                          "characters.last_name",
                          "characters.portrait_id",
                        ])
                        .whereRef("characters.id", "=", "nodes.character_id")
                        .where("characters.is_public", "=", true)
                    ).as("character"),
                  ])
              ).as("nodes")
            )
          )
          .$if(!!body?.relations?.edges, (qb) =>
            qb.select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("edges")
                  .where("edges.parent_id", "=", params.id)
                  .selectAll()
              ).as("edges")
            )
          )

          .executeTakeFirst();

        if (data?.is_public)
          return {
            data,
            message: MessageEnum.success,
            ok: true,
          };

        return {
          data: { is_public: false },
          message: MessageEnum.success,
          ok: true,
        };
      },
      {
        body: ReadGraphSchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/calendars/:id",
      async ({ params, body }) => {
        const data = await db
          .selectFrom("calendars")
          .where("calendars.id", "=", params.id)
          .where("calendars.is_public", "=", true)
          .select(body.fields as SelectExpression<DB, "calendars">[])
          .$if(!!body?.relations, (qb) => {
            if (body.relations?.months) {
              qb = qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("months")
                    .select([
                      "months.id",
                      "months.days",
                      "months.sort",
                      "months.title",
                      "months.parent_id",
                    ])
                    .where("months.parent_id", "=", params.id)
                    .orderBy("months.sort")
                ).as("months")
              );
            }
            if (body.relations?.leap_days) {
              qb = qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("leap_days")
                    .select([
                      "leap_days.id",
                      "leap_days.month_id",
                      "leap_days.parent_id",
                      "leap_days.conditions",
                    ])
                    .where("leap_days.parent_id", "=", params.id)
                ).as("leap_days")
              );
            }

            return qb;
          })
          .executeTakeFirst();
        if (data?.is_public)
          return {
            data,
            message: MessageEnum.success,
            ok: true,
          };
        return {
          data: { is_public: false },
          message: MessageEnum.success,
          ok: true,
        };
      },
      {
        body: ReadCalendarSchema,
        response: ResponseWithDataSchema,
      }
    )

    .post(
      "/assets/:project_id/:type/:id",
      async ({ params, body }) => {
        const data = await db
          .selectFrom("images")
          .where("images.id", "=", params.id)
          .where("images.is_public", "=", true)
          .select(body.fields as SelectExpression<DB, "images">[])
          .executeTakeFirst();
        return {
          data,
          message: MessageEnum.success,
          ok: true,
        };
      },
      {
        body: RequestBodySchema,
        response: ResponseWithDataSchema,
      }
    )

    .post(
      "/dictionaries/:id",
      async ({ params, body }) => {
        const data = await db
          .selectFrom("dictionaries")
          .where("dictionaries.id", "=", params.id)
          .select(
            body.fields.map((f) => `dictionaries.${f}`) as SelectExpression<
              DB,
              "dictionaries"
            >[]
          )
          .$if(!!body.relations?.words, (qb) =>
            qb.select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("words")
                  .select([
                    "words.id",
                    "words.title",
                    "words.translation",
                    "words.is_public",
                  ])
                  .where("words.parent_id", "=", params.id)
              ).as("words")
            )
          )

          .executeTakeFirst();
        if (data?.is_public)
          return {
            data,
            message: MessageEnum.success,
            ok: true,
          };
        return {
          data: { is_public: false },
          message: MessageEnum.success,
          ok: true,
        };
      },
      {
        body: ReadDictionarySchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/words/:id",
      async ({ params, body }) => {
        const data = await db
          .selectFrom("words")
          .leftJoin("dictionaries", "dictionaries.id", "words.parent_id")
          .where("words.id", "=", params.id)
          .where("dictionaries.is_public", "=", true)
          .select(
            // @ts-ignore
            body.fields
              .map((f) => `words.${f}`)
              .concat("dictionaries.is_public") as SelectExpression<
              DB,
              "words"
            >[]
          )
          .executeTakeFirst();
        if (data?.is_public)
          return {
            data,
            message: MessageEnum.success,
            ok: true,
          };
        return {
          data: { is_public: false },
          message: MessageEnum.success,
          ok: true,
        };
      },
      {
        body: ReadWordSchema,
        response: ResponseWithDataSchema,
      }
    )
    .post(
      "/events/:id",
      async ({ params, body }) => {
        const data = await db
          .selectFrom("events")
          .select(body.fields as SelectExpression<DB, "events">[])
          .where("events.id", "=", params.id)
          .where("events.is_public", "=", true)
          .executeTakeFirst();

        if (data?.is_public)
          return {
            data,
            message: MessageEnum.success,
            ok: true,
          };
        return {
          data: { is_public: false },
          message: MessageEnum.success,
          ok: true,
        };
      },
      {
        body: ReadEventSchema,
        response: ResponseWithDataSchema,
      }
    );
}
