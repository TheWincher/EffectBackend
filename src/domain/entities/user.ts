import { Effect, Schema } from "effect";
import { HashedPassword, UserId } from "../value-objects/user";

export const UserRole = Schema.Literal("ADMIN", "USER");
export type UserRole = Schema.Schema.Type<typeof UserRole>;

export const User = Schema.Struct({
  id: UserId,
  username: Schema.String,
  password: HashedPassword,
  role: UserRole,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
});
export type User = Schema.Schema.Type<typeof User>;

export function createUser(username: string, hashedPassword: HashedPassword) {
  const currDate = new Date();
  return Schema.decodeUnknown(User)({
    id: crypto.randomUUID(),
    username,
    password: hashedPassword,
    role: "USER",
    createdAt: currDate,
    updatedAt: currDate,
  });
}
