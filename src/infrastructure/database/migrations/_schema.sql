CREATE TABLE IF NOT EXISTS "effect_sql_migrations" (
  migration_id integer PRIMARY KEY NOT NULL,
  created_at datetime NOT NULL DEFAULT current_timestamp,
  name VARCHAR(255) NOT NULL
);
CREATE TABLE todos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
  );
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

INSERT INTO effect_sql_migrations VALUES(1,'2026-06-10 08:00:05','create_todos');
INSERT INTO effect_sql_migrations VALUES(2,'2026-06-10 08:00:05','create_users');