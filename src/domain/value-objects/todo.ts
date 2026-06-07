import { Schema } from "effect";

export const TodoId = Schema.String.pipe(Schema.brand("TodoId"));
export type TodoId = Schema.Schema.Type<typeof TodoId>;