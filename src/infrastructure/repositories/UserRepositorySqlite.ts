import { Effect, Layer, Schema } from "effect";
import { SqlClient } from "@effect/sql";
import { SqlLive } from "../database/sqlite";
import { UserRepository } from "../../domain/repositories/user";
import { UserNotFound } from "../../domain/errors/user";
import { User } from "../../domain/entities/user";

export const UserRepositorySqliteLayer = Layer.effect(
  UserRepository,
  Effect.gen(function* () {
    const client = yield* SqlClient.SqlClient;

    return {
      findById: (id) =>
        Effect.gen(function* () {
          const rows = yield* client`SELECT * FROM users WHERE id = ${id}`;

          if (!rows.length) {
            return yield* Effect.fail(new UserNotFound());
          }

          return yield* Schema.decodeUnknown(User)(rows[0]);
        }).pipe(
          Effect.catchAll((err) =>
            err._tag === "UserNotFound" ? Effect.fail(err) : Effect.die(err),
          ),
        ),
      findByUsername: (username) =>
        Effect.gen(function* () {
          const rows =
            yield* client`SELECT * FROM users WHERE username = ${username}`;

          if (!rows.length) {
            return yield* Effect.fail(new UserNotFound());
          }

          return yield* Schema.decodeUnknown(User)(rows[0]);
        }).pipe(
          Effect.catchAll((err) =>
            err._tag === "UserNotFound" ? Effect.fail(err) : Effect.die(err),
          ),
        ),
      save: (user) =>
        Effect.gen(function* () {
          yield* client`INSERT INTO users (id, username, password, role, createdAt, updatedAt) VALUES (${user.id}, ${user.username}, ${user.password}, ${user.role}, ${user.createdAt.toISOString()}, ${user.updatedAt.toISOString()})`;

          return user;
        }).pipe(Effect.orDie),
    };
  }),
).pipe(Layer.provide(SqlLive));
