import { Effect, Schema } from "effect";
import { TodoId } from "../../domain/value-objects/todo";
import { TodoRepository } from "../../domain/repositories/todo";
import { completeTodo, type Todo } from "../../domain/entities/todo";

export function GetTodoById(id: TodoId) {
  return Effect.gen(function* () {
    yield* Effect.log(`Getting todo`).pipe(Effect.annotateLogs({ id }));

    const repo = yield* TodoRepository;
    return yield* repo.findById(id);
  });
}

export function CreateTodo(title: string) {
  return Effect.gen(function* () {
    yield* Effect.log(`Creating todo`).pipe(Effect.annotateLogs({ title }));

    const repo = yield* TodoRepository;
    const todoId = yield* Schema.decodeUnknown(TodoId)(crypto.randomUUID());

    const newTodo = {
      id: todoId,
      title,
      completed: false,
    } satisfies Todo;

    return yield* repo.save(newTodo);
  }).pipe(Effect.withLogSpan("CreateTodo"));
}

export function CompleteTodo(id: TodoId) {
  return Effect.gen(function* () {
    yield* Effect.log(`Updating completed todo with id: ${id}`);

    const repo = yield* TodoRepository;
    const todo = yield* repo.findById(id);

    const completedTodo = yield* completeTodo(todo);
    return yield* repo.save(completedTodo);
  });
}

export function GetAllTodos() {
  return Effect.gen(function* () {
    yield* Effect.log(`Getting all todos`);

    const repo = yield* TodoRepository;
    return yield* repo.findAll();
  });
}

export function DeleteTodoById(id: TodoId) {
  return Effect.gen(function* () {
    yield* Effect.log(`Deleting todo with id: ${id}`);

    const repo = yield* TodoRepository;
    return yield* repo.delete(id);
  });
}
