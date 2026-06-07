import {
  HttpRouter,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { Effect, Schema } from "effect";
import {
  CompleteTodo,
  CreateTodo,
  DeleteTodoById,
  GetAllTodos,
  GetTodoById,
} from "../../application/use-cases/todo";
import { TodoId } from "../../domain/value-objects/todo";

export const router = HttpRouter.empty.pipe(
  HttpRouter.get(
    "/todos/:id",
    Effect.gen(function* () {
      const params = yield* HttpRouter.schemaPathParams(
        Schema.Struct({ id: Schema.UUID }),
      );

      const todoId = yield* Schema.decodeUnknown(TodoId)(params.id);
      const todo = yield* GetTodoById(todoId);
      return yield* HttpServerResponse.json(todo);
    }).pipe(
      Effect.catchTag("TodoNotFound", () =>
        HttpServerResponse.json({ error: "Not found" }, { status: 404 }),
      ),
    ),
  ),
  HttpRouter.post(
    "/todos",
    Effect.gen(function* () {
      const body = yield* HttpServerRequest.schemaBodyJson(
        Schema.Struct({ title: Schema.String }),
      );

      const todo = yield* CreateTodo(body.title);
      return yield* HttpServerResponse.json(todo, { status: 201 });
    }),
  ),
  HttpRouter.patch(
    "/todos/:id/complete",
    Effect.gen(function* () {
      const params = yield* HttpRouter.schemaPathParams(
        Schema.Struct({ id: Schema.UUID }),
      );

      const todoId = yield* Schema.decodeUnknown(TodoId)(params.id);
      const todo = yield* CompleteTodo(todoId);
      return yield* HttpServerResponse.json(todo);
    }).pipe(
      Effect.catchTag("TodoNotFound", () =>
        HttpServerResponse.json({ error: "Not found" }, { status: 404 }),
      ),
      Effect.catchTag("TodoAlreadyCompleted", () =>
        HttpServerResponse.json({ error: "Conflict" }, { status: 409 }),
      ),
    ),
  ),
  HttpRouter.get(
    "/todos",
    Effect.gen(function* () {
      const todos = yield* GetAllTodos();
      return yield* HttpServerResponse.json(todos);
    }),
  ),
  HttpRouter.del(
    "/todos/:id",
    Effect.gen(function* () {
      const params = yield* HttpRouter.schemaPathParams(
        Schema.Struct({ id: Schema.UUID }),
      );

      const todoId = yield* Schema.decodeUnknown(TodoId)(params.id);

      yield* DeleteTodoById(todoId);
      return yield* HttpServerResponse.empty({ status: 204 });
    }).pipe(
      Effect.catchTag("TodoNotFound", () =>
        HttpServerResponse.json({ error: "Not found" }, { status: 404 }),
      ),
    ),
  ),
);
