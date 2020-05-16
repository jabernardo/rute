import {
  Server,
  Request,
  Response,
  Middleware,
  Next,
  HTTP,
} from "../../mod.ts";

import { Logger } from "../../middlewares/logger/mod.ts";

import { routes } from "./routes/mod.ts";

export const app: Server = new Server("main_app");

app.use(Logger());

app.use(routes);
