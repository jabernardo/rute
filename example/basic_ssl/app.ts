import {
  Server,
  Request,
  Response,
  Middleware,
  Next,
  HTTP,
} from "../../mod.ts";

import { Logger } from "../../middlewares/logger/mod.ts";

const app: Server = new Server();

/**
 * Use Logging Middleware
 *
 */
app.use(Logger());

/**
 * Static file server
 *   http://localhost:8000/public/style.css
 */
app.static("./public");

/**
 * Middleware example
 */
app.use(async (req: Request, res: Response, n: Next) => {
  console.log("[begin] middleware");
  await n();
  console.log("[end] middleware");
});

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
}, specificRouteMiddleware);

app.post("/hello-{name}", (req: Request, res: Response) => {
  res.set(`Are you sure?, ${req.param("name")} !`);
}, specificRouteMiddleware);

/**
 * LET'S GO!!!
 */
app.listen({ port: 8080 });

app.listen({
  hostname: "localhost",
  port: 8443,
  certFile: "./ssl/cert.pem",
  keyFile: "./ssl/key.pem",
});
