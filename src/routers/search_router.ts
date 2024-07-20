import Elysia from "elysia";
import { db } from "../database/db";
import { MessageEnum } from "../enums";
import { BasicSearchSchema } from "../database/validation";

export function search_router(app: Elysia) {
  return app.post(
    "/search/:project_id",
    async ({ params, body }) => {
      const { project_id } = params;
      const { search_term } = body.data;
      const charactersSearch = {
        name: "characters",
        request: db
          .selectFrom("characters")
          .select(["id", "full_name as label", "portrait_id as image"])
          .where("characters.full_name", "ilike", `%${search_term}%`)
          .where("characters.is_public", "=", true)
          .where("project_id", "=", project_id)
          .limit(5),
      };
      const documentSearch = {
        name: "documents",
        request: db
          .selectFrom("documents")
          .select(["id", "title as label", "icon"])
          .where("documents.title", "ilike", `%${search_term}%`)
          .where("documents.is_public", "=", true)
          .where((wb) =>
            wb.or([wb("is_folder", "=", false), wb("is_folder", "is", null)])
          )
          .where("project_id", "=", project_id)
          .limit(5),
      };

      const mapSearch = {
        name: "maps",
        request: db
          .selectFrom("maps")
          .select(["id", "title as label"])
          .where("maps.title", "ilike", `%${search_term}%`)
          .where("maps.is_public", "=", true)
          .where((wb) =>
            wb.or([wb("is_folder", "=", false), wb("is_folder", "is", null)])
          )
          .where("project_id", "=", project_id)
          .limit(5),
      };

      const mapPinSearch = {
        name: "map_pins",
        request: db
          .selectFrom("map_pins")
          .leftJoin("maps", "maps.id", "map_pins.parent_id")
          .where("maps.is_public", "=", true)
          .where("map_pins.is_public", "=", true)
          .where("map_pins.title", "is not", null)
          .where("map_pins.title", "ilike", `%${search_term}%`)
          .select([
            "map_pins.id",
            "map_pins.is_public",
            "map_pins.title as label",
            "map_pins.icon",
            "map_pins.parent_id",
            "maps.title as parent_title",
          ])
          .limit(5),
      };
      const characterMapPinSearch = {
        name: "character_map_pins",
        request: db
          .selectFrom("map_pins")
          .leftJoin("maps", "maps.id", "map_pins.parent_id")
          .leftJoin("characters", "characters.id", "map_pins.character_id")
          .where("map_pins.character_id", "is not", null)
          .where("maps.is_public", "=", true)
          .where("map_pins.is_public", "=", true)
          .where("characters.full_name", "ilike", `%${search_term}%`)
          .where("characters.is_public", "=", true)
          .select([
            "map_pins.id",
            "map_pins.icon",
            "map_pins.parent_id",
            "map_pins.is_public",
            "maps.title as parent_title",
            "characters.full_name as label",
            "characters.portrait_id",
          ])
          .limit(5),
      };

      const graphSearch = {
        name: "graphs",
        request: db
          .selectFrom("graphs")
          .where("graphs.title", "ilike", `%${search_term}%`)
          .where("project_id", "=", project_id)
          .where((wb) =>
            wb.or([wb("is_folder", "=", false), wb("is_folder", "is", null)])
          )
          .select(["id", "title as label", "icon"])
          .limit(5),
      };

      const blueprintInstancesSearch = {
        name: "blueprint_instances",
        request: db
          .selectFrom("blueprint_instances")
          .leftJoin(
            "blueprints",
            "blueprints.id",
            "blueprint_instances.parent_id"
          )
          .where("blueprint_instances.title", "ilike", `%${search_term}%`)
          .where("blueprints.project_id", "=", project_id)
          .where("blueprint_instances.is_public", "=", true)
          .select([
            "blueprint_instances.id",
            "blueprint_instances.title as label",
            "blueprints.title as parent_title",
            "blueprint_instances.parent_id",
            "blueprints.icon",
          ])
          .limit(5),
      };

      const requests = [
        charactersSearch,
        documentSearch,
        mapSearch,
        mapPinSearch,
        characterMapPinSearch,
        graphSearch,
        blueprintInstancesSearch,
      ];
      const result = await Promise.all(
        requests.map(async (item) => ({
          name: item.name,
          result: await item.request.execute(),
        }))
      );
      return {
        data: result,
        ok: true,
        role_access: true,
        message: MessageEnum.success,
      };
    },
    { body: BasicSearchSchema }
  );
}
