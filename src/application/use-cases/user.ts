import { Effect } from "effect";
import type { RawPassword } from "../../domain/value-objects/user";
import { UserRepository } from "../../domain/repositories/user";
import {
  InvalidCredentials,
  UsernameAlreadyExists,
} from "../../domain/errors/user";
import { PasswordHasher } from "../../domain/repositories/password";
import { createUser } from "../../domain/entities/user";

export function Register(username: string, rawPassword: RawPassword) {
  return Effect.gen(function* () {
    const userRepo = yield* UserRepository;

    yield* userRepo.findByUsername(username).pipe(
      Effect.catchTag("UserNotFound", () => Effect.void),
      Effect.flatMap(() => Effect.fail(new UsernameAlreadyExists())),
    );

    const passwordHasher = yield* PasswordHasher;
    const hashedPassord = yield* passwordHasher.hash(rawPassword);

    const user = yield* createUser(username, hashedPassord);
    return yield* userRepo.save(user);
  });
}

export function Login(username: string, rawPassword: RawPassword) {
  return Effect.gen(function* () {
    const userRepo = yield* UserRepository;

    const currentUser = yield* userRepo
      .findByUsername(username)
      .pipe(
        Effect.catchTag("UserNotFound", () =>
          Effect.fail(new InvalidCredentials()),
        ),
      );

    const passwordHasher = yield* PasswordHasher;
    const passwordMatched = yield* passwordHasher.verify(
      rawPassword,
      currentUser.password,
    );

    if (!passwordMatched) return yield* Effect.fail(new InvalidCredentials());
    return currentUser;
  });
}
