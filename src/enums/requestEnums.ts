import { ComparisonOperatorExpression } from "kysely";

export const FilterEnum: { [key: string]: ComparisonOperatorExpression } = {
  eq: "=",
  neq: "<>",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  ilike: "ilike",
  in: "in",
  is: "is",
  "is not": "is not",
  "not in": "not in",
};

export const MessageEnum = {
  success: "Success.",
  route_not_found: "Route not found.",
  error_entity_not_public: "Access forbidden - this entity is not public.",
};
