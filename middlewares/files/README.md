# Static File Serve

Serve static files

## Usage

```ts
import {
  Server,
  Request,
  Response,
  Middleware,
  Next,
  HTTP,
} from "../../mod.ts";

import { files } from "https://deno.land/x/rute/middlewares/files/mod.ts";

const app: Server = new Server();

app.use(files("folder_path"));

```

### Example

```ts
import {
  Server,
  Request,
  Response,
  Middleware,
  Next,
  HTTP,
} from "../../mod.ts";

import { files } from "https://deno.land/x/rute/middlewares/files/mod.ts";

const app: Server = new Server();

app.use(files("public"));
```
