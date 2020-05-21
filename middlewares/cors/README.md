# CORS Middleware for Rute

A basic CORS middleware

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

import { cors } from "https://deno.land/x/rute/middlewares/cors/mod.ts"

const app: Server = new Server();

app.use(cors());

```

## Using on Routes

```ts

import {
  Server,
  Request,
  Response,
  Middleware,
  Next,
  HTTP,
} from "../../mod.ts";

import { cors } from "https://deno.land/x/rute/middlewares/cors/mod.ts"

const app: Server = new Server();

const corsOptions = {
  origin: [
    /http:\/\/localhost:*/,
    /www.gooogle.com/,
    /developers.mozilla.org/
  ],
  methods: "DELETE"
};

app.options("/cors", cors(corsOptions));
app.delete("/cors", async (req: Request, res: Response) => {
  res.set("CORS enabled page").finalize();
}, cors(corsOptions));

```