import { describe, expect, test } from "bun:test";
import { Cause, Effect, Exit, Option, Schema } from "effect";
import { CompleteTodo, CreateTodo, GetTodoById } from "./todo";
import { TodoRepositoryInMemoryLayer } from "../../infrastructure/repositories/TodoRepositoryInMemory";
import { TodoId } from "../../domain/value-objects/todo";
import { TodoAlreadyCompleted, TodoNotFound } from "../../domain/errors/todos";

test("CreateTodo", async () => {
  const result = await Effect.runPromise(
    CreateTodo("Ma todo").pipe(Effect.provide(TodoRepositoryInMemoryLayer)),
  );

  expect(result.title).toBe("Ma todo");
  expect(result.completed).toBeFalse();
});

describe("GetTodoById", async () => {
  test("Not found", async () => {
    const exit = await Effect.runPromiseExit(
      Schema.decodeUnknown(TodoId)(crypto.randomUUID()).pipe(
        Effect.flatMap((id) =>
          GetTodoById(id).pipe(Effect.provide(TodoRepositoryInMemoryLayer)),
        ),
      ),
    );

    expect(Exit.isFailure(exit)).toBeTrue();
    if (Exit.isFailure(exit)) {
      const error = Cause.failureOption(exit.cause);
      expect(Option.isSome(error)).toBeTrue();

      if (Option.isSome(error)) {
        expect(error.value).toBeInstanceOf(TodoNotFound);
      }
    }
  });

  test("Found", async () => {
    const todo = await Effect.runPromise(
      Effect.gen(function* () {
        const todo = yield* CreateTodo("Ma todo");
        return yield* GetTodoById(todo.id);
      }).pipe(Effect.provide(TodoRepositoryInMemoryLayer)),
    );

    expect(todo).toBeDefined();
  });
});

describe("CompleteTodo", async () => {
  test("Already completed", async () => {
    const exit = await Effect.runPromiseExit(
      Effect.gen(function* () {
        const todo = yield* CreateTodo("Ma todo");
        yield* CompleteTodo(todo.id);
        return yield* CompleteTodo(todo.id);
      }).pipe(Effect.provide(TodoRepositoryInMemoryLayer)),
    );

    expect(Exit.isFailure(exit)).toBeTrue();
    if (Exit.isFailure(exit)) {
      const error = Cause.failureOption(exit.cause);
      expect(Option.isSome(error)).toBeTrue();

      if (Option.isSome(error)) {
        expect(error.value).toBeInstanceOf(TodoAlreadyCompleted);
      }
    }
  });

  test("Not completed", async () => {
    const todo = await Effect.runPromise(
      Effect.gen(function* () {
        const todo = yield* CreateTodo("Ma todo");
        return yield* CompleteTodo(todo.id);
      }).pipe(Effect.provide(TodoRepositoryInMemoryLayer)),
    );

    expect(todo).toBeDefined();
    expect(todo.completed).toBeTrue();
  });
});
