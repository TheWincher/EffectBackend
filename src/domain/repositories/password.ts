import { Context, type Effect } from "effect";
import type { HashedPassword, RawPassword } from "../value-objects/user";

interface IPasswordHasher {
  hash(password: RawPassword): Effect.Effect<HashedPassword>;
  verify(raw: RawPassword, hashed: HashedPassword): Effect.Effect<boolean>;
}

export class PasswordHasher extends Context.Tag("PasswordHasher")<
  PasswordHasher,
  IPasswordHasher
>() {}
