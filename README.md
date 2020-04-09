# Rute 
A Simple Router for Deno

## Prerequisites

- deno ^0.39.0

## Installation

```ts

import { Rute, Request, Response, Middleware, Next } from "https://raw.githubusercontent.com/jabernardo/rute/master/mod.ts";

```

## Run this example

```sh

deno --allow-net --allow-read https://raw.githubusercontent.com/jabernardo/rute/master/example/app.ts

```

## Hello World!

```ts

import { Rute, Request, Response } from "https://raw.githubusercontent.com/jabernardo/rute/master/mod.ts";

const app: Rute = new Rute();

app.add(["GET", "POST"], "/", (req: Request, res: Response) => {
  res.set({"message": "Hello World!"});
});

app.listen({ port: 8000 });

```

## Contibuting to TheF!
To contribute to TheF! Make sure to give a star and forked this repository.

Alternatively see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## License
The `Rute` is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
