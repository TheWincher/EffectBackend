import { Effect, Schema } from "effect";
import { TodoId } from "../../domain/value-objects/todo";
import { TodoRepository } from "../../domain/repositories/todo";
import { completeTodo, type Todo } from "../../domain/entities/todo";

export function GetTodoById(id: TodoId) {
  return Effect.gen(function* () {
    const repo = yield* TodoRepository;
    return yield* repo.findById(id);
  });
}

export function CreateTodo(title: string) {
  return Effect.gen(function* () {
    const repo = yield* TodoRepository;
    const todoId = yield* Schema.decodeUnknown(TodoId)(crypto.randomUUID());

    const newTodo = {
      id: todoId,
      title,
      completed: false,
    } satisfies Todo;

    return yield* repo.save(newTodo);
  });
}

export function CompleteTodo(id: TodoId) {
  return Effect.gen(function* () {
    const repo = yield* TodoRepository;
    const todo = yield* repo.findById(id);

    const completedTodo = yield* completeTodo(todo);
    return yield* repo.save(completedTodo);
  })
}

export function GetAllTodos() {
  return Effect.gen(function* () {
    const repo = yield* TodoRepository;
    return yield* repo.findAll();
  })
}

export function DeleteTodoById(id: TodoId) {
  return Effect.gen(function* () {
    const repo = yield* TodoRepository;
    return yield* repo.delete(id);
  });
}
