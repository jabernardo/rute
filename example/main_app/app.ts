import { Server, Request, Response, Middleware, Next, HTTP } from "../../mod.ts";

import { routes } from "./routes.ts";

const app: Server = new Server();

/**
 * Static file server
 *   http://localhost:8000/public/style.css
 */
app.static("./public");

app.use(routes);

app.listen({ port: 8000 });