import { t } from "elysia";
import { Graphs } from "kysely-codegen";

import { RequestBodySchema } from "../../types/requestTypes";

const NodeShapeEnum = t.Optional(
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

export const ReadGraphSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          nodes: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
          edges: t.Optional(t.Boolean()),
          children: t.Optional(t.Boolean()),
          parents: t.Optional(t.Boolean()),
        })
      ),
      permissions: t.Optional(t.Boolean()),
    })
  ),
]);

export const GenerateGraphSchema = t.Object({
  data: t.Object({
    title: t.String(),
    project_id: t.String(),
  }),
  relations: t.Object({
    nodes: t.Array(
      t.Object({
        data: t.Object({
          // id is required here so that the edges can
          // use it as a source/target_id when creating
          id: t.String(),
          // parent_id does not exist before the graph is generated
          //// parent_id: t.String(),
          label: t.Optional(t.Union([t.String(), t.Null()])),
          type: NodeShapeEnum,
          width: t.Optional(t.Number()),
          height: t.Optional(t.Number()),
          x: t.Number(),
          y: t.Number(),
          font_size: t.Optional(t.Union([t.Number(), t.Null()])),
          font_color: t.Optional(t.Union([t.String(), t.Null()])),
          font_family: t.Optional(t.Union([t.String(), t.Null()])),
          text_v_align: t.Optional(t.Union([t.String(), t.Null()])),
          text_h_align: t.Optional(t.Union([t.String(), t.Null()])),
          background_color: t.Optional(t.Union([t.String(), t.Null()])),
          background_opacity: t.Optional(t.Union([t.Number(), t.Null()])),
          is_template: t.Optional(t.Union([t.Boolean(), t.Null()])),
          z_index: t.Optional(t.Union([t.Number(), t.Null()])),
          doc_id: t.Optional(t.Union([t.String(), t.Null()])),
          character_id: t.Optional(t.Union([t.String(), t.Null()])),
          event_id: t.Optional(t.Union([t.String(), t.Null()])),
          image_id: t.Optional(t.Union([t.String(), t.Null()])),
          map_id: t.Optional(t.Union([t.String(), t.Null()])),
          map_pin_id: t.Optional(t.Union([t.String(), t.Null()])),
        }),
      })
    ),
    edges: t.Optional(
      t.Array(
        t.Object({
          data: t.Object({
            // parent_id does not exist before the graph is generated
            //// parent_id: t.String(),
            source_id: t.String(),
            target_id: t.String(),
            label: t.Optional(t.Union([t.String(), t.Null()])),
            curve_style: t.Optional(t.Union([t.String(), t.Null()])),
            line_style: t.Optional(t.Union([t.String(), t.Null()])),
            line_color: t.Optional(t.Union([t.String(), t.Null()])),
            line_fill: t.Optional(t.Union([t.String(), t.Null()])),
            line_opacity: t.Optional(t.Union([t.Number(), t.Null()])),
            width: t.Optional(t.Union([t.Number(), t.Null()])),
            control_point_distances: t.Optional(
              t.Union([t.Number(), t.Null()])
            ),
            control_point_weights: t.Optional(t.Union([t.Number(), t.Null()])),
            taxi_direction: t.Optional(t.Union([t.String(), t.Null()])),
            taxi_turn: t.Optional(t.Union([t.Number(), t.Null()])),
            arrow_scale: t.Optional(t.Union([t.Number(), t.Null()])),

            target_arrow_shape: t.Optional(t.Union([t.String(), t.Null()])),
            target_arrow_fill: t.Optional(t.Union([t.String(), t.Null()])),
            target_arrow_color: t.Optional(t.Union([t.String(), t.Null()])),
            source_arrow_shape: t.Optional(t.Union([t.String(), t.Null()])),
            source_arrow_fill: t.Optional(t.Union([t.String(), t.Null()])),
            source_arrow_color: t.Optional(t.Union([t.String(), t.Null()])),
            mid_target_arrow_shape: t.Optional(t.Union([t.String(), t.Null()])),
            mid_target_arrlow_fill: t.Optional(t.Union([t.String(), t.Null()])),
            mid_target_arrlow_color: t.Optional(
              t.Union([t.String(), t.Null()])
            ),
            mid_source_arrow_shape: t.Optional(t.Union([t.String(), t.Null()])),
            mid_source_arrow_fill: t.Optional(t.Union([t.String(), t.Null()])),
            mid_source_arrow_color: t.Optional(t.Union([t.String(), t.Null()])),

            font_size: t.Optional(t.Union([t.Number(), t.Null()])),
            font_color: t.Optional(t.Union([t.String(), t.Null()])),
            font_family: t.Optional(t.Union([t.String(), t.Null()])),
            z_index: t.Optional(t.Union([t.Number(), t.Null()])),
          }),
        })
      )
    ),
  }),
});

export type BoardColumns = keyof Graphs;
