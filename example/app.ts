import { Rute, Request, Response, Middleware, Next } from "../mod.ts";

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
app.add(["GET", "POST"], "/", async (req: Request, res: Response) => {
  let data = await fetch("https://hacker-news.firebaseio.com/v0/item/2921983.json?print=pretty");
  let json = await data.json();
  console.log(json);
  res.set(json);
});

/**
 * Simple greeting
 *   http://localhost:8000/hello-yourname
 */
app.add("GET", "/hello-{name}", (req: Request, res: Response) => {
  res.set(`Hello, ${ req.params("name") } !`);
});

/**
 * LET'S GO!!!
 */
app.listen({ port: 8000 });