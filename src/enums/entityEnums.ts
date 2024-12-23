import { TagsRelationTables } from "../database/types";

export const AllEntities = [
  "characters",
  "blueprints",
  "blueprint_instances",
  "documents",
  "maps",
  "graphs",
  "calendars",
  "dictionaries",
  "character_fields_templates",
  "character_fields",
  "conversations",
  "random_tables",
  "tags",
];

export const SubEntityEnum = [
  "alter_names",
  "blueprint_instances",
  "map_pins",
  "character_map_pins",
  "map_layers",
  "nodes",
  "edges",
  "events",
  "random_table_options",
  "words",
];

export const EntitiesWithTagsTablesEnum: TagsRelationTables[] = [
  "_charactersTotags",
  "_documentsTotags",
  "_graphsTotags",
  "_mapsTotags",
  "_map_pinsTotags",
  "_calendarsTotags",
  "_eventsTotags",
  "_dictionariesTotags",
  "_edgesTotags",
  "_nodesTotags",
  "_character_fields_templatesTotags",
  "_blueprint_instancesTotags",
  "image_tags",
  "manuscript_tags",
];

export const newTagTables = ["image_tags", "manuscript_tags"];

export const EntitiesWithoutProjectIdEnum = [
  "map_pins",
  "character_map_pins",
  "map_layers",
  "nodes",
  "edges",
  "events",
];
