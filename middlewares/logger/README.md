# Logger Middleware for Rute

A customizable logger middleware especially made for Rute.

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

import { logger } from "https://deno.land/x/rute/middlewares/logger/mod.ts";

const app: Server = new Server();

app.use(logger());

```

## Custom Format

### Template Keys

- `:host`             - Host name
- `:host_port`        - Host port
- `:host_transport`   - Host transport method
- `:remote_host`      - Client host name
- `:remote_port`      - Client host port
- `:remote_transport` - Client transport method
- `:request_method`   - Request method
- `:request_url`      - Request url
- `:response_code`    - Response status code


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

import { logger } from "https://deno.land/x/rute/middlewares/logger/mod.ts";

const app: Server = new Server();

app.use(logger("@ :host::host_port/:host_transport ( from :remote_host::remote_port/:remote_transport - :request_method - :response_code - :request_url )"));

```

### Using Hooks

```ts
import {
  Server,
  Request,
  Response,
  Middleware,
  Next,
  HTTP,
} from "../../mod.ts";

import { logger, DEFAULT_LOG_FORMAT } from "https://deno.land/x/rute/middlewares/logger/mod.ts";

const app: Server = new Server();

const loggerCatch = (msg: string) => {
  console.log(`==> ${msg}`);
}

app.use(logger(DEFAULT_LOG_FORMAT, loggerCatch));

```