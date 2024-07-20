import { SelectQueryBuilder } from "kysely";
import { DB } from "kysely-codegen";

import { RequestOrderByType } from "../types/requestTypes";

export function constructOrdering(
  orderBy: RequestOrderByType[] | undefined,
  qb: SelectQueryBuilder<DB, any, any>
) {
  if (orderBy) {
    for (let index = 0; index < orderBy.length; index++) {
      const order = orderBy[index];
      qb = qb.orderBy(order?.field as string, order?.sort || "asc");
    }
  }
  return qb;
}
