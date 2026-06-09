import { Context, Effect, Layer, Schedule, Schema } from "effect";
import { UserRole } from "../../domain/entities/user";
import { UserId } from "../../domain/value-objects/user";
import { jwtVerify, SignJWT } from "jose";
import { ConfigLive } from "../config";

interface IJwtService {
  sign(payload: { userId: UserId; role: UserRole }): Effect.Effect<string>;
  verify(
    token: string,
  ): Effect.Effect<{ userId: UserId; role: UserRole }, InvalidToken>;
}

export class InvalidToken {
  readonly _tag = "InvalidToken";
}

export class JwtService extends Context.Tag("JwtService")<
  JwtService,
  IJwtService
>() {}

export const JwtServiceLayer = Layer.effect(
  JwtService,
  Effect.gen(function* () {
    const config = yield* ConfigLive;
    const secret = new TextEncoder().encode(config.jwtSecret);
    return {
      sign: (payload) => {
        const jwt = new SignJWT({
          iat: new Date().getTime(),
          sub: JSON.stringify(payload),
        }).setProtectedHeader({ alg: "HS256" });

        return Effect.promise(() => jwt.sign(secret));
      },
      verify: (token) => {
        return Effect.gen(function* () {
          const { payload } = yield* Effect.tryPromise({
            try: () => jwtVerify(token, secret),
            catch: () => new InvalidToken(),
          });

          if (!payload.sub) return yield* Effect.fail(new InvalidToken());
          const p = yield* Schema.decodeUnknown(
            Schema.Struct({ userId: UserId, role: UserRole }),
          )(JSON.parse(payload.sub)).pipe(
            Effect.catchAll(() => Effect.fail(new InvalidToken())),
          );

          return {
            userId: p.userId,
            role: p.role,
          };
        });
      },
    };
  }),
);
