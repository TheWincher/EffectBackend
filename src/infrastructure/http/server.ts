import { HttpServer } from "@effect/platform";
import { NodeHttpServer } from "@effect/platform-node";
import { Effect, Layer } from "effect";
import { createServer } from "node:http";
import { router } from "./router";
import { ConfigLive } from "../config";

export const ServerLive = Layer.unwrapEffect(
  Effect.gen(function* () {
    const config = yield* ConfigLive;
    return HttpServer.serve(router).pipe(
      Layer.provide(NodeHttpServer.layer(createServer, { port: config.port })),
    );
  }),
);
