import { SqliteMigrator } from "@effect/sql-sqlite-bun";

export const MigratorLive = SqliteMigrator.layer({
  schemaDirectory: `${import.meta.dir}/migrations`,
  loader: SqliteMigrator.fromFileSystem(`${import.meta.dir}/migrations`),
});
