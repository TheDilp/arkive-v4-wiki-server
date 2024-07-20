import { t } from "elysia";

import { FilterEnum } from "../enums/requestEnums";

export type SearchableEntities =
  | "characters"
  | "documents"
  | "maps"
  | "map_pins"
  | "graphs"
  | "nodes"
  | "edges"
  | "blueprints"
  | "blueprint_instances"
  | "random_tables"
  | "calendars"
  | "images"
  | "map_images"
  | "events"
  | "dictionaries"
  | "words"
  | "tags";
export type SearchableMentionEntities =
  | "characters"
  | "blueprint_instances"
  | "documents"
  | "maps"
  | "map_pins"
  | "graphs"
  | "nodes"
  | "words";

export type RequestFilterOperatorType = keyof typeof FilterEnum;

export interface RequestFilterType {
  id: string;
  field: string;
  value: string | number | string[] | number[] | boolean | boolean[] | null;
  operator: RequestFilterOperatorType;
  relationalData?: {
    blueprint_field_id?: string;
    character_field_id?: string;
  };
}

export interface RequestBodyFiltersType {
  and?: RequestFilterType[];
  or?: RequestFilterType[];
}
export type SortType = "asc" | "desc";
export interface RequestOrderByType {
  field: string;
  sort: SortType;
}

export interface RequestPaginationType {
  limit?: number;
  page?: number;
}

export interface RequestBodyType<T extends { data: any; relations: any }> {
  data?: T["data"];
  fields: string[];
  orderBy?: RequestOrderByType[];
  pagination?: RequestPaginationType;
  relations?: T["relations"];
  filters?: RequestBodyFiltersType;
  relationFilters?: RequestBodyFiltersType;
}

export const FilterEnumSchema = t.Union([
  t.Literal("eq"),
  t.Literal("neq"),
  t.Literal("gt"),
  t.Literal("gte"),
  t.Literal("lt"),
  t.Literal("lte"),
  t.Literal("ilike"),
  t.Literal("in"),
  t.Literal("is"),
  t.Literal("not in"),
  t.Literal("is not"),
]);

const RequestFilterSchema = t.Optional(
  t.Array(
    t.Object({
      id: t.String(),
      field: t.String(),
      value: t.Union([
        t.String(),
        t.Number(),
        t.Boolean(),
        t.Null(),
        t.Array(t.String()),
        t.Array(t.Number()),
        t.Array(t.Boolean()),
      ]),
      operator: FilterEnumSchema,
    })
  )
);

export const RequestBodySchema = t.Object({
  fields: t.Array(t.String()),
  orderBy: t.Optional(
    t.Array(
      t.Object({
        field: t.String(),
        sort: t.Union([t.Literal("asc"), t.Literal("desc")]),
      })
    )
  ),
  pagination: t.Optional(
    t.Object({
      limit: t.Optional(t.Number({ default: 10 })),
      page: t.Optional(t.Number({ default: 0 })),
    })
  ),
  filters: t.Optional(
    t.Object({
      and: RequestFilterSchema,
      or: RequestFilterSchema,
    })
  ),
  relationFilters: t.Optional(
    t.Object({
      and: RequestFilterSchema,
      or: RequestFilterSchema,
    })
  ),
  permissions: t.Optional(t.Boolean()),
  arkived: t.Optional(t.Boolean()),
});

export const ResponseSchema = t.Object({
  message: t.String(),
  ok: t.Boolean(),
  role_access: t.Boolean(),
});
export const ResponseWithDataSchema = t.Object({
  data: t.Any(),
  message: t.String(),
  ok: t.Boolean(),
  role_access: t.Boolean(),
});
