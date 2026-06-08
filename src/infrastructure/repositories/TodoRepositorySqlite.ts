import { Effect, Layer, Schema, type Context } from "effect";
import { TodoRepository } from "../../domain/repositories/todo";
import { TodoSchema, type Todo } from "../../domain/entities/todo";
import { TodoNotFound } from "../../domain/errors/todos";
import { SqlClient } from "@effect/sql";
import { SqlLive } from "../database/sqlite";

export const TodoRepositorySqliteLayer = Layer.effect(
  TodoRepository,
  Effect.gen(function* () {
    const client = yield* SqlClient.SqlClient;

    return {
      findById: (id) =>
        Effect.gen(function* () {
          const rows = yield* client`SELECT * FROM todos WHERE id = ${id}`;

          if (!rows.length) {
            return yield* Effect.fail(new TodoNotFound());
          }

          return yield* Schema.decodeUnknown(TodoSchema)(rows[0]);
        }).pipe(Effect.catchTag("TodoNotFound", Effect.fail), Effect.orDie),
      findAll: () =>
        Effect.gen(function* () {
          const rows = yield* client`SELECT * FROM todos`;

          return yield* Schema.decodeUnknown(Schema.Array(TodoSchema))(rows);
        }).pipe(Effect.orDie),
      save: (todo) =>
        Effect.gen(function* () {
          yield* client`INSERT INTO todos (id, title, completed) VALUES (${todo.id}, ${todo.title}, ${todo.completed})`;

          return todo;
        }).pipe(Effect.orDie),
      delete: (id) =>
        Effect.gen(function* () {
          const rows = yield* client`SELECT * FROM todos WHERE id = ${id}`;

          if (!rows.length) {
            return yield* Effect.fail(new TodoNotFound());
          }

          yield* client`DELETE FROM todos WHERE id = ${id}`;
        }).pipe(Effect.catchTag("TodoNotFound", Effect.fail), Effect.orDie),
    };
  }),
).pipe(Layer.provide(SqlLive));
