import { DeduplicateJoinsPlugin, Kysely, PostgresDialect } from "kysely";
import { DB } from "kysely-codegen";
import { Pool } from "pg";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 80,
    idleTimeoutMillis: 5000,
  }),
});

export const db = new Kysely<DB>({
  dialect,
  plugins: [new DeduplicateJoinsPlugin()],
});
