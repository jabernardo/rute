import {
  HTTP,
  Middleware,
  Next,
  Request,
  Response,
  Server,
} from "../../mod.ts";

import { files } from "../../middlewares/files/mod.ts";
import { catcher } from "../../middlewares/catcher/mod.ts";
import { logger } from "../../middlewares/logger/mod.ts";

const app: Server = new Server();

/************************************
 * Use Available Middlewares
 *
 */

/**
 * Static file server
 *   http://localhost:8000/style.css
 */
app.use(files("./public"));
app.use(catcher());
app.use(logger());

/**
 * Middleware example
 */
const exampleMiddleware: Middleware = async (
  req: Request,
  res: Response,
  n: Next,
) => {
  console.log("[begin] middleware");
  await n();
  console.log("[end] middleware");
};

app.use(exampleMiddleware);

/**
 * Index page
 */
app.all("/", async (req: Request, res: Response) => {
  let data = await fetch(
    "https://hacker-news.firebaseio.com/v0/item/2921983.json?print=pretty",
  );
  let json = await data.json();
  res.cookie({ name: "test", value: "hello world!!!!" });
  res.set(json);
});

/**
 * A certain specific route middleware
 *
 */
const specificRouteMiddleware = async (
  req: Request,
  res: Response,
  n: Next,
) => {
  console.log("[begin] route middleware");
  await n();
  console.log("[end] route middleware");
};

/**
 * Simple greeting
 *   http://localhost:8000/hello-yourname
 */
app.get("/hello-{name}", (req: Request, res: Response) => {
  res.set(`Hello, ${req.param("name")} !`);
  throw new Error("Hello World!");
}, specificRouteMiddleware);

/**
 * LET'S GO!!!
 */
app.listen({ port: 8000 });
