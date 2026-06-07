
import { Context, Effect, Layer } from "effect";
import type { Todo } from "../../domain/entities/todo";
import { TodoNotFound } from "../../domain/errors/todos";
import { TodoRepository } from "../../domain/repositories/todo";
import type { TodoId } from "../../domain/value-objects/todo";

class TodoRepositoryInMemory implements Context.Tag.Service<typeof TodoRepository> {
    private todos = new Map<TodoId, Todo>();

    findById(id: TodoId): Effect.Effect<Todo, TodoNotFound> {
        const todo = this.todos.get(id);
        return todo ? Effect.succeed(todo) : Effect.fail(new TodoNotFound());
    }

    findAll(): Effect.Effect<Todo[]> {
        return Effect.succeed(Array.from(this.todos.values()));
    }

    save(todo: Todo): Effect.Effect<Todo> {
        this.todos.set(todo.id, todo);
        return Effect.succeed(todo);
    }

    delete(id: TodoId): Effect.Effect<void, TodoNotFound> {
        return this.todos.delete(id) ? Effect.succeed(undefined) : Effect.fail(new TodoNotFound());
    }
    
}

export const TodoRepositoryInMemoryLayer = Layer.succeed(TodoRepository, new TodoRepositoryInMemory());