<p align="center">
<image src="https://raw.githubusercontent.com/jabernardo/rute/master/assets/rute.png" width="40%" height="40%" />
</p>

# Rute
A Simple Router for Deno
([https://deno.land/x/rute](https://deno.land/x/rute))

![Deno Test](https://github.com/jabernardo/rute/workflows/Deno%20Test/badge.svg)
[![tag](https://img.shields.io/badge/deno-v1.0.0rc2-green.svg)](https://github.com/denoland/deno)

## Prerequisites

- deno 1.0.0-rc2

## Releases

- `0.8` - Rute for Deno v0.41.0
- `0.9` - Rute for Deno v1.0.0-rc2
- `0.10` - Rute for Deno v1.0.0-rc2 (use of registry https://deno.land/x/rute/)
- `0.11` - Rute for Deno v1.0.0

## Branches

- `master` - Recent Release
- `0.x` - Development branch for version 0.x

## Installation

```ts

import { Server, Request, Response, Middleware, Next } from "https://deno.land/x/rute/mod.ts";

```

## Run this example

```sh

 deno run --allow-net --allow-read "https://deno.land/x/rute/example/basic/app.ts"

```

## Hello World!

```ts

import { Server, Request, Response } from "https://deno.land/x/rute/mod.ts";

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

## Learn more!
Our wiki is located [here](https://github.com/jabernardo/rute/wiki)

## Contibuting to Rute!
To contribute to Rute! Make sure to give a star and forked this repository.

Alternatively see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## License
The `Rute` is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
