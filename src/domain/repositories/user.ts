import { Context, Effect } from "effect";
import type { UserId } from "../value-objects/user";
import type { User } from "../entities/user";
import type { UserNotFound } from "../errors/user";

interface IUserRepository {
  findById(id: UserId): Effect.Effect<User, UserNotFound>;
  findByUsername(username: string): Effect.Effect<User, UserNotFound>;
  save(user: User): Effect.Effect<User>;
}

export class UserRepository extends Context.Tag("UserRepository")<
  UserRepository,
  IUserRepository
>() {}
