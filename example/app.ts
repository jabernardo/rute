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
app.use((req: Request, res: Response, n: Next) => {
  console.log("[begin] middleware");
  n();
  console.log("[end] middleware");
});

/**
 * Index page
 */
app.add(["GET", "POST"], "/", (req: Request, res: Response) => {
  res.set({"message": "Hello World!"});
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