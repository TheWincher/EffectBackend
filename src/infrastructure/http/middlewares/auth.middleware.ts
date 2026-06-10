import {
  HttpMiddleware,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { Effect, FiberRef, Option } from "effect";
import { InvalidToken, JwtService } from "../../auth/jwt";
import type { UserId } from "../../../domain/value-objects/user";
import type { UserRole } from "../../../domain/entities/user";

export const CurrentUser = FiberRef.unsafeMake<
  Option.Option<{ userId: UserId; role: UserRole }>
>(Option.none());

export const AuthMiddleware = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest;
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      return yield* Effect.fail(new InvalidToken());
    }

    const splitedAuthHeader = authHeader.split(" ");
    if (splitedAuthHeader.length !== 2 || splitedAuthHeader[0] !== "Bearer") {
      return yield* Effect.fail(new InvalidToken());
    }

    const token = splitedAuthHeader[1];
    if (!token) {
      return yield* Effect.fail(new InvalidToken());
    }

    const jwtService = yield* JwtService;
    const payload = yield* jwtService.verify(token);
    yield* FiberRef.set(CurrentUser, Option.some(payload));

    return yield* app;
  }).pipe(
    Effect.catchTag("InvalidToken", () =>
      HttpServerResponse.json({ error: "Unauthorized" }, { status: 401 }),
    ),
  ),
);
