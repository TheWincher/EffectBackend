import { Schema } from "effect";

export const UserId = Schema.String.pipe(Schema.brand("UserId"));
export type UserId = Schema.Schema.Type<typeof UserId>;

export const RawPassword = Schema.String.pipe(
  Schema.length({ min: 8, max: Infinity }),
  Schema.filter((value) => value.match(/[A-Z]/) !== null, {
    message: () => "Password must contain at least one uppercase letter",
  }),
  Schema.filter((value) => value.match(/[a-z]/) !== null, {
    message: () => "Password must contain at least one lowercase letter",
  }),
  Schema.filter((value) => value.match(/\d/) !== null, {
    message: () => "Password must contain at least one number",
  }),
  Schema.filter((value) => value.match(/[^a-zA-Z0-9]/) !== null, {
    message: () => "Password must contain at least one special caracter",
  }),
  Schema.brand("RawPassword"),
);
export type RawPassword = Schema.Schema.Type<typeof RawPassword>;

export const HashedPassword = Schema.String.pipe(
  Schema.brand("HashedPassword"),
);
export type HashedPassword = Schema.Schema.Type<typeof HashedPassword>;
