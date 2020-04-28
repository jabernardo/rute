import { Server, Request, Response, Middleware, Next, HTTP } from "../../mod.ts";

import { routes } from "./routes/mod.ts";

const app: Server = new Server();

app.use(routes);

app.listen({ port: 8000 });