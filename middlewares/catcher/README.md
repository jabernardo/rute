# Error Catcher Middleware for Rute

A customizable error middleware especially made for Rute.

> Important! This middleware must come first!


## Basic Usage

```ts

import {
  Server,
  Request,
  Response,
  Middleware,
  Next,
  HTTP,
} from "../../mod.ts";

// import { catcher } from "https://deno.land/x/rute/middlewares/catcher/mod.ts"
import { catcher } from "./mod.ts";

const app: Server = new Server();

app.use(catcher());

```

## Using Custom Callback

```ts

import {
  Server,
  Request,
  Response,
  Middleware,
  Next,
  HTTP,
} from "../../mod.ts";

// import { catcher } from "https://deno.land/x/rute/middlewares/catcher/mod.ts"
import { CatcherCallback, catcher } from "../../middlewares/catcher/mod.ts";

const sampleErrorHandler = (err: Error, req: Request, res: Response) => {
  // TODO: Your actions here...
}

const app: Server = new Server();

app.use(catcher(sampleErrorHandler));

```