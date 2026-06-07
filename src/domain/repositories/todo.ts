import { Context, type Effect } from "effect";
import type { TodoId } from "../value-objects/todo";
import type { Todo } from "../entities/todo";
import type { TodoNotFound } from "../errors/todos";

interface ITodoRepository {
    findById(id: TodoId): Effect.Effect<Todo, TodoNotFound>;
    findAll(): Effect.Effect<Todo[]>;
    save(todo: Todo): Effect.Effect<Todo>;
    delete(id: TodoId): Effect.Effect<void, TodoNotFound>;
}

export class TodoRepository extends Context.Tag("TodoRepository")<
  TodoRepository,
  ITodoRepository
>() {}