import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Layer, Logger } from "effect";
import { ServerLive } from "./infrastructure/http/server";
import { TodoRepositorySqliteLayer } from "./infrastructure/repositories/TodoRepositorySqlite";
import { MigratorLive } from "./infrastructure/database/migrator";
import { SqlLive } from "./infrastructure/database/sqlite";
import { UserRepositorySqliteLayer } from "./infrastructure/repositories/UserRepositorySqlite";
import { PasswordHasherBcryptLayer } from "./infrastructure/auth/password";
import { JwtServiceLayer } from "./infrastructure/auth/jwt";

NodeRuntime.runMain(
  Layer.launch(
    Layer.mergeAll(
      MigratorLive.pipe(
        Layer.provide(SqlLive),
        Layer.provide(NodeContext.layer),
      ),
      Layer.provide(
        ServerLive,
        Layer.mergeAll(
          TodoRepositorySqliteLayer,
          UserRepositorySqliteLayer,
          PasswordHasherBcryptLayer,
          JwtServiceLayer,
        ),
      ),
    ).pipe(Layer.provide(Logger.pretty)),
  ),
);
