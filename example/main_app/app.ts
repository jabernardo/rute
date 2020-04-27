import { Rute, Request, Response, Middleware, Next, HTTP } from "../../mod.ts";

import { routes } from "./routes.ts";

const app: Rute = new Rute();
const appTest: Rute = new Rute("boo", "boo");

appTest.all("/", async (req: Request, res: Response) => {
  res.set("asdasdasd");
});

/**
 * Static file server
 *   http://localhost:8000/public/style.css
 */
routes.static("./public");

app.use(routes);
app.use(appTest);

app.listen({ port: 8000 });