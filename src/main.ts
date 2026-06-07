import { NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";
import { ServerLive } from "./infrastructure/http/server";
import { TodoRepositoryInMemoryLayer } from "./infrastructure/repositories/TodoRepositoryInMemory";

NodeRuntime.runMain(
  Layer.launch(
    Layer.provide(ServerLive, TodoRepositoryInMemoryLayer)
  )
)