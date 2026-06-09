import { HttpRouter } from "@effect/platform";
import { todoRouter } from "./routers/todo.router";
import { authRouter } from "./routers/auth.router";

export const router = HttpRouter.empty.pipe(
  HttpRouter.concat(todoRouter),
  HttpRouter.concat(authRouter),
);
