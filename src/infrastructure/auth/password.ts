import { Effect, Layer, type Context } from "effect";
import { PasswordHasher } from "../../domain/repositories/password";
import type {
  RawPassword,
  HashedPassword,
} from "../../domain/value-objects/user";

class PasswordHasherBcrypt implements Context.Tag.Service<
  typeof PasswordHasher
> {
  hash(password: RawPassword): Effect.Effect<HashedPassword> {
    return Effect.promise(() => Bun.password.hash(password, "bcrypt")).pipe(
      Effect.map((hash) => hash as HashedPassword),
    );
  }

  verify(raw: RawPassword, hashed: HashedPassword): Effect.Effect<boolean> {
    return Effect.promise(() => Bun.password.verify(raw, hashed));
  }
}

export const PasswordHasherBcryptLayer = Layer.succeed(
  PasswordHasher,
  new PasswordHasherBcrypt(),
);
