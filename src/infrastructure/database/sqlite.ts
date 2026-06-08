import { SqliteClient } from "@effect/sql-sqlite-bun";
import { Effect, Layer } from "effect";
import { ConfigLive } from "../config";

export const SqlLive = Layer.unwrapEffect(
  Effect.gen(function* () {
    const config = yield* ConfigLive;
    return SqliteClient.layer({ filename: config.dbPath });
  }),
);
