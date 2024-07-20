import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const NodeShapeEnum = t.Optional(
  t.Union([
    t.Literal("rectangle"),
    t.Literal("ellipse"),
    t.Literal("triangle"),
    t.Literal("barrel"),
    t.Literal("rhomboid"),
    t.Literal("diamond"),
    t.Literal("pentagon"),
    t.Literal("hexagon"),
    t.Literal("heptagon"),
    t.Literal("octagon"),
    t.Literal("star"),
    t.Literal("cut-rectangle"),
    t.Literal("round-triangle"),
    t.Literal("round-rectangle"),
    t.Literal("bottom-round-rectangle"),
    t.Literal("round-diamond"),
    t.Literal("round-pentagon"),
    t.Literal("round-hexagon"),
    t.Literal("round-heptagon"),
    t.Literal("round-octagon"),
    t.Null(),
  ])
);

export const ReadNodeSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    relations: t.Optional(
      t.Object({
        tags: t.Optional(t.Boolean()),
        image: t.Optional(t.Boolean()),
        character: t.Optional(t.Boolean()),
        document: t.Optional(t.Boolean()),
        map_pin: t.Optional(t.Boolean()),
        event: t.Optional(t.Boolean()),
      })
    ),
  }),
]);

export const ListNodesSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ parent_id: t.String() }) }),
]);
