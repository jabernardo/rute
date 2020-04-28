import { Router, Request, Response, Next, HTTP } from "../../../mod.ts";

import { Home } from "./home.ts";

export const routes: Router = new Router();

routes.all("/", Home.index.bind(Home));
