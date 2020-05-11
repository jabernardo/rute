<p align="center">
<image src="https://raw.githubusercontent.com/jabernardo/rute/0.x/assets/rute.png" width="40%" height="40%" />
</p>

# Rute 
A Simple Router for Deno

![Deno Test](https://github.com/jabernardo/rute/workflows/Deno%20Test/badge.svg)
[![tag](https://img.shields.io/badge/deno-v1.0.0rc2-green.svg)](https://github.com/denoland/deno)

## Prerequisites

- deno 1.0.0-rc2

## Releases

- `0.8` - Rute for Deno v0.41.0

## Branches

- `0.x` - Development branch for version 0.x

## Installation

```ts

import { Server, Request, Response, Middleware, Next } from "https://raw.githubusercontent.com/jabernardo/rute/{release}/mod.ts";

```

## Run this example

```sh

deno run --allow-net --allow-read https://raw.githubusercontent.com/jabernardo/rute/0.x/example/basic/app.ts

```

## Hello World!

```ts

import { Server, Request, Response } from "https://raw.githubusercontent.com/jabernardo/rute/0.x/mod.ts";

const app: Server = new Server();

app.get("/", (req: Request, res: Response) => {
  res.set({"message": "Hello World!"});
});

app.listen({ port: 8000 });

```

## Built-in await/async support!

```ts

/**
 * Index page
 */
app.all("/", async (req: Request, res: Response) => {
  let data = await fetch("https://hacker-news.firebaseio.com/v0/item/2921983.json?print=pretty");
  let json = await data.json();
  console.log(json);
  res.set(json);
});


```

## Want to combine your apps?

```ts
import { app as secondApp } from "../second_app/app.ts";

/**
 * Root application
 *
 * path: /
 */
const app: Server = new Server("multi_app");

/**
 * Second application
 *
 * path: /second
 */
app.use(secondApp.rebase("second"));
```

## Contibuting to Rute!
To contribute to Rute! Make sure to give a star and forked this repository.

Alternatively see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## License
The `Rute` is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
