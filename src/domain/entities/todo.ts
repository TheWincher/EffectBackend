import { Effect } from "effect";
import type { TodoId } from "../value-objects/todo";
import { TodoAlreadyCompleted } from "../errors/todos";

export type Todo = {
  id: TodoId;
  title: string;
  completed: boolean;
};

export function completeTodo(todo: Todo) {
  if (todo.completed === true) {
    return Effect.fail(new TodoAlreadyCompleted());
  }

  return Effect.succeed({ ...todo, completed: true });
}
