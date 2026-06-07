import { Effect, Schema } from "effect";
import { TodoAlreadyCompleted } from "../errors/todos";
import { TodoId } from "../value-objects/todo";

export const TodoSchema = Schema.Struct({
    id : TodoId,
    title: Schema.String,
    completed: Schema.BooleanFromUnknown,
});

export type Todo = Schema.Schema.Type<typeof TodoSchema>;

export function completeTodo(todo: Todo) {
  if (todo.completed === true) {
    return Effect.fail(new TodoAlreadyCompleted());
  }

  return Effect.succeed({ ...todo, completed: true });
}
