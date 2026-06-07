import { SqliteClient } from "@effect/sql-sqlite-bun";

export const SqlLive = SqliteClient.layer({filename: "todos"});