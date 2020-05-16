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

// import { Catcher } from "https://deno.land/x/rute/middlewares/catcher/mod.ts"
import { Catcher } from "./mod.ts";

const app: Server = new Server();

app.use(Catcher());

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

// import { Catcher } from "https://deno.land/x/rute/middlewares/catcher/mod.ts"
import { CatcherCallback, Catcher } from "../../middlewares/catcher/mod.ts";

const sampleErrorHandler = (err: Error, req: Request, res: Response) => {
  // TODO: Your actions here...
}

const app: Server = new Server();

app.use(Catcher(sampleErrorHandler));

```