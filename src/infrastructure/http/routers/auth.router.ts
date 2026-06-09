import {
  HttpRouter,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { Effect, Schema } from "effect";
import { RawPassword } from "../../../domain/value-objects/user";
import { Login, Register } from "../../../application/use-cases/user";
import {
  InvalidCredentials,
  InvalidPassword,
} from "../../../domain/errors/user";
import { JwtService } from "../../auth/jwt";

export const authRouter = HttpRouter.empty.pipe(
  HttpRouter.post(
    "/register",
    Effect.gen(function* () {
      const body = yield* HttpServerRequest.schemaBodyJson(
        Schema.Struct({ username: Schema.String, password: Schema.String }),
      );

      const rawPassword = yield* Schema.decodeUnknown(RawPassword)(
        body.password,
      ).pipe(
        Effect.catchTag("ParseError", () => Effect.fail(new InvalidPassword())),
      );

      const user = yield* Register(body.username, rawPassword);

      return yield* HttpServerResponse.json(user, { status: 201 });
    }).pipe(
      Effect.catchTag("UsernameAlreadyExists", () =>
        HttpServerResponse.json(
          { error: "Username already exists" },
          { status: 409 },
        ),
      ),
      Effect.catchTag("InvalidPassword", () =>
        HttpServerResponse.json({ error: "Invalid password" }, { status: 400 }),
      ),
    ),
  ),
  HttpRouter.post(
    "/login",
    Effect.gen(function* () {
      const body = yield* HttpServerRequest.schemaBodyJson(
        Schema.Struct({ username: Schema.String, password: Schema.String }),
      );

      const rawPassword = yield* Schema.decodeUnknown(RawPassword)(
        body.password,
      ).pipe(
        Effect.catchTag("ParseError", () =>
          Effect.fail(new InvalidCredentials()),
        ),
      );

      const user = yield* Login(body.username, rawPassword);
      const jwtService = yield* JwtService;

      const jwt = yield* jwtService.sign({ userId: user.id, role: user.role });
      return yield* HttpServerResponse.json({ accessToken: jwt });
    }).pipe(
      Effect.catchTag("InvalidCredentials", () =>
        HttpServerResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        ),
      ),
    ),
  ),
  HttpRouter.prefixAll("/auth"),
);
