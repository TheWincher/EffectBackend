import { HttpServer } from "@effect/platform";
import { NodeHttpServer } from "@effect/platform-node";
import { Layer } from "effect";
import { createServer } from "node:http";
import { router } from "./router";

export const ServerLive = HttpServer.serve(router).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port: 8080 }))
)