import { SqliteMigrator } from "@effect/sql-sqlite-bun";

export const MigratorLive = SqliteMigrator.layer({
  schemaDirectory: "/src/infrastructure/database/migrations",
  loader: SqliteMigrator.fromFileSystem(`${import.meta.dir}/migrations`),
});
