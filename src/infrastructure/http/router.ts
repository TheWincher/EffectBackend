import { HttpRouter } from "@effect/platform";
import { todoRouter } from "./routers/todo.router";

export const router = HttpRouter.empty.pipe(
  HttpRouter.concat(todoRouter)
)
