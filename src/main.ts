import { NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";
import { ServerLive } from "./infrastructure/http/server";
import { TodoRepositorySqliteLayer } from "./infrastructure/repositories/TodoRepositorySqlite";

NodeRuntime.runMain(
  Layer.launch(
    Layer.provide(ServerLive, TodoRepositorySqliteLayer)
  )
)