import { Rute, Request, Response, Middleware, Next, HTTP } from "../mod.ts";

const app: Rute = new Rute();

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
app.get("/hello-{name}", (req: Request, res: Response) => {
  res.set(`Hello, ${ req.params("name") } !`);
}, specificRouteMiddleware);

app.post("/hello-{name}", (req: Request, res: Response) => {
  res.set(`Are you sure?, ${ req.params("name") } !`);
}, specificRouteMiddleware);

/**
 * LET'S GO!!!
 */
app.listen({ port: 8000 });