import { SelectQueryBuilder, sql } from "kysely";
import { DB } from "kysely-codegen";

import { AvailablePermissions, EntitiesWithPermissionCheck } from "../../types/entityTypes";
import { PermissionDecorationType } from "../../types/requestTypes";
import { db } from "../db";

export function checkEntityLevelPermission(
  qb: SelectQueryBuilder<any, any, any>,
  permissions: PermissionDecorationType,
  entity: EntitiesWithPermissionCheck,
  related_id?: string,
) {
  qb = qb
    .leftJoin("entity_permissions", "entity_permissions.related_id", `${entity}.id`)
    .where((wb: any) =>
      wb.or([
        wb(`${entity}.owner_id`, "=", permissions.user_id),
        wb.and([
          wb("entity_permissions.user_id", "=", permissions.user_id),
          wb("entity_permissions.permission_id", "=", permissions.permission_id),
          wb("entity_permissions.related_id", "=", related_id || wb.ref(`${entity}.id`)),
        ]),
        wb("entity_permissions.role_id", "=", permissions.role_id),
      ]),
    );

  return qb;
}

export async function getHasEntityPermission(
  entity: EntitiesWithPermissionCheck,
  id: string,
  permissions: PermissionDecorationType,
): Promise<boolean> {
  const permissionCheck = await db
    .selectFrom(entity)
    .where(`${entity}.id`, "=", id)
    .$if(!permissions.is_project_owner, (qb) => {
      return checkEntityLevelPermission(qb, permissions, entity, id);
    })
    .select(sql<boolean>`${true}`.as("hasPermission"))
    .executeTakeFirst();

  return !!permissionCheck?.hasPermission;
}

export function getNestedReadPermission(
  subquery: SelectQueryBuilder<DB, any, any>,
  is_project_owner: boolean,
  user_id: string,
  related_table_with_field: string,
  permission_code: AvailablePermissions,
  isPublic?: boolean,
) {
  if (isPublic) return subquery;
  if (!is_project_owner) {
    // @ts-ignore
    subquery = subquery
      .leftJoin("entity_permissions", "entity_permissions.related_id", related_table_with_field)
      // @ts-ignore
      .leftJoin("permissions", "entity_permissions.permission_id", "permissions.id")
      .where("entity_permissions.user_id", "=", user_id)
      .where("permissions.code", "=", permission_code);
  }
  return subquery;
}
