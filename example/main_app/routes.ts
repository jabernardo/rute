import { Rute, Router, Request, Response, Middleware, Next, HTTP } from "../../mod.ts";

export const routes: Router = new Router("test");

/**
 * Static file server
 *   http://localhost:8000/public/style.css
 */
routes.static("./public");

/**
 * Middleware example
 */
routes.use(async (req: Request, res: Response, n: Next) => {
  console.log("[begin] middleware");
  await n();
  console.log("[end] middleware");
});

/**
 * Index page
 */
routes.all("/", async (req: Request, res: Response) => {
  let data = await fetch("https://hacker-news.firebaseio.com/v0/item/2921983.json?print=pretty");
  let json = await data.json();
  res.cookie({ name: "test", value: "hello world!!!!" });
  res.set(json);
});

/**
 * A certain specific route middleware
 *
 */
const specificRouteMiddleware = async (req: Request, res: Response, n: Next) => {
  console.log("[begin] route middleware");
  await n();
  console.log("[end] route middleware");
};

/**
 * Simple greeting
 *   http://localhost:8000/hello-yourname
 */
routes.get("/hello-{name}", (req: Request, res: Response) => {
  res.set(`Hello, ${ req.param("name") } !`);
  console.log(req.query("test", "boo"));
}, specificRouteMiddleware);

routes.post("/hello-{name}", (req: Request, res: Response) => {
  res.set(`Are you sure?, ${ req.param("name") } !`);
}, specificRouteMiddleware);
