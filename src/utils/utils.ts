import { createHmac } from "crypto";
import { readFile } from "fs";

import {
  HeadingType,
  MentionAtomType,
  ParagraphType,
} from "../types/documentContentTypes";
import {
  AssetType,
  AvailableEntityType,
  AvailableSubEntityType,
} from "../types/entityTypes";
import {
  RequestBodyFiltersType,
  RequestFilterType,
} from "../types/requestTypes";

export function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

type MainRandomPickType = {
  id: string;
  title: string;
  description?: string | null;
  suboptions?: { id: string; title: string }[];
};

export type GroupedQueryFilter = RequestFilterType & { type: "AND" | "OR" };
export interface GroupedQueries {
  [key: string]: {
    filters: GroupedQueryFilter[];
  };
}

export function groupFiltersByField(
  queryStructure: RequestBodyFiltersType
): GroupedQueries {
  const groupedQueries: GroupedQueries = {};

  for (const groupKey of ["and", "or"]) {
    // @ts-ignore
    const group = queryStructure[groupKey];
    if (group) {
      for (const query of group) {
        const { field, ...rest } = query;
        if (!groupedQueries[field]) {
          groupedQueries[field] = {
            filters: [],
          };
        }

        const newFilter = rest;
        newFilter.type = groupKey.toUpperCase() as "AND" | "OR";
        groupedQueries[field].filters.push(newFilter);
      }
    }
  }

  return groupedQueries;
}
export function groupRelationFiltersByField(
  queryStructure: RequestBodyFiltersType
): GroupedQueries {
  const groupedQueries: GroupedQueries = {};

  for (const groupKey of ["and", "or"]) {
    // @ts-ignore
    const group = queryStructure[groupKey];
    if (group) {
      for (const query of group) {
        const { field, ...rest } = query;
        if (!groupedQueries[field]) {
          groupedQueries[field] = {
            filters: [],
          };
        }
        if (
          rest?.relationalData?.character_field_id ||
          rest?.relationalData?.blueprint_field_id
        ) {
          const newFilter = rest;
          newFilter.type = groupKey.toUpperCase() as "AND" | "OR";
          groupedQueries[field].filters.push(newFilter);
        }
      }
    }
  }

  return groupedQueries;
}

export function groupCharacterResourceFiltersByField(
  queryStructure: RequestBodyFiltersType
): GroupedQueries {
  const groupedQueries: GroupedQueries = {};

  for (const groupKey of ["and", "or"]) {
    // @ts-ignore
    const group = queryStructure[groupKey];
    if (group) {
      for (const query of group) {
        const { field, ...rest } = query;
        if (!groupedQueries[field]) {
          groupedQueries[field] = {
            filters: [],
          };
        }
        if (!rest?.relationalData?.character_field_id) {
          const newFilter = rest;
          newFilter.type = groupKey.toUpperCase() as "AND" | "OR";
          groupedQueries[field].filters.push(newFilter);
        }
      }
    }
  }

  return groupedQueries;
}

export function groupByBlueprintFieldId(
  data: GroupedQueryFilter[]
): Record<string, GroupedQueryFilter[]> {
  const grouped: Record<string, GroupedQueryFilter[]> = {};

  data.forEach((obj) => {
    if (obj.relationalData) {
      const { blueprint_field_id } = obj.relationalData;
      if (!blueprint_field_id) return;
      if (grouped[blueprint_field_id]) {
        grouped[blueprint_field_id].push(obj);
      } else {
        grouped[blueprint_field_id] = [obj];
      }
    }
  });

  return grouped;
}
export function groupByCharacterFieldId(
  data: GroupedQueryFilter[]
): Record<string, GroupedQueryFilter[]> {
  const grouped: Record<string, GroupedQueryFilter[]> = {};

  data.forEach((obj) => {
    if (obj.relationalData) {
      const { character_field_id } = obj.relationalData;
      if (!character_field_id) return;
      if (grouped[character_field_id]) {
        grouped[character_field_id].push(obj);
      } else {
        grouped[character_field_id] = [obj];
      }
    }
  });

  return grouped;
}

export function groupByCharacterResourceId(
  data: GroupedQueryFilter[]
): Record<string, GroupedQueryFilter[]> {
  const grouped: Record<string, GroupedQueryFilter[]> = {};

  data.forEach((obj) => {
    if (obj?.id) {
      const { id } = obj;
      if (!id) return;
      if (grouped[id]) {
        grouped[id].push(obj);
      } else {
        grouped[id] = [obj];
      }
    }
  });

  return grouped;
}

export function groupCharacterFields(originalItems: any[]): any[] {
  const groupedItems: Record<string, any> = {};

  originalItems.forEach((item) => {
    const {
      id,
      characters,
      blueprint_instances,
      events,
      images,
      documents,
      map_pins,
    } = item;

    if (!groupedItems[id]) {
      groupedItems[id] = {
        id,
        characters: [],
        blueprint_instances: [],
        events: [],
        images: [],
        documents: [],
        map_pins: [],
      };
    }

    groupedItems[id].characters.push(...(characters || []));
    groupedItems[id].blueprint_instances.push(...(blueprint_instances || []));
    groupedItems[id].events.push(...(events || []));
    groupedItems[id].documents.push(...(documents || []));
    groupedItems[id].images.push(...(images || []));
    groupedItems[id].map_pins.push(...(map_pins || []));
  });

  return Object.values(groupedItems);
}
