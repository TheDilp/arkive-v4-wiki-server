import { DB } from "kysely-codegen";

export type DBKeys = keyof DB;
export type DBValues = DB[DBKeys];

export type TagsRelationTables =
  | "_charactersTotags"
  | "_documentsTotags"
  | "_graphsTotags"
  | "_mapsTotags"
  | "_map_pinsTotags"
  | "_calendarsTotags"
  | "_eventsTotags"
  | "_dictionariesTotags"
  | "_edgesTotags"
  | "_nodesTotags"
  | "_character_fields_templatesTotags"
  | "_blueprint_instancesTotags"
  | "image_tags"
  | "manuscript_tags";
export type EntitiesWithTags =
  | "images"
  | "maps"
  | "graphs"
  | "characters"
  | "calendars"
  | "events"
  | "documents"
  | "dictionaries"
  | "edges"
  | "nodes"
  | "character_fields_templates"
  | "blueprint_instances"
  | "manuscripts";

export type EntitiesWithChildren = "documents" | "maps" | "graphs" | "calendars" | "dictionaries" | "random_tables";

export type BlueprintInstanceRelationEntities = "characters" | "documents" | "map_pins" | "events";
export type CharacterRelationEntities = "characters" | "blueprint_instances" | "documents" | "map_pins" | "events";
export type CharacterResourceEntities = "documents" | "images" | "events" | "maps";
export type EventRelationEntities = "characters" | "map_pins";

export type BlueprintInstanceRelationTables =
  | "blueprint_instance_characters"
  | "blueprint_instance_documents"
  | "blueprint_instance_map_pins"
  | "blueprint_instance_events";

export type CharacterRelationTables =
  | "character_characters_fields"
  | "character_blueprint_instance_fields"
  | "character_documents_fields"
  | "character_locations_fields"
  | "character_events_fields";

export type CharacterResourceTables = "_charactersTodocuments" | "_charactersToimages" | "event_characters" | "maps";

export type EventRelationTables = "event_characters" | "event_map_pins";
