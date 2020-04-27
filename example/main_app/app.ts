import { Rute, Request, Response, Middleware, Next, HTTP } from "../../mod.ts";

import { routes } from "./routes.ts";

const app: Rute = new Rute();

app.use(routes);

app.listen({ port: 8000 });