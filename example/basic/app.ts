import {
  Server,
  Request,
  Response,
  Middleware,
  Next,
  HTTP,
} from "../../mod.ts";

import { catcher } from "../../middlewares/catcher/mod.ts";
import { logger } from "../../middlewares/logger/mod.ts";
import { cors, corsRoute, CorsCallback } from "../../middlewares/cors/mod.ts";

const app: Server = new Server();

/**
 * Use Available Middlewares
 *
 */
app.use(catcher());
app.use(logger());

/**
 * Static file server
 *   http://localhost:8000/public/style.css
 */
app.static("./public");
app.static("./public/test");

/**
 * Middleware example
 */
const exampleMiddleware: Middleware = async (
  req: Request,
  res: Response,
  n: Next,
) => {
  console.log("[begin] middleware");
  await n();
  console.log("[end] middleware");
};

app.use(exampleMiddleware);

/**
 * Index page
 */
app.all("/", async (req: Request, res: Response) => {
  let data = await fetch(
    "https://hacker-news.firebaseio.com/v0/item/2921983.json?print=pretty",
  );
  let json = await data.json();
  res.cookie({ name: "test", value: "hello world!!!!" });
  res.set(json);
});

/**
 * A certain specific route middleware
 *
 */
const specificRouteMiddleware = async (
  req: Request,
  res: Response,
  n: Next,
) => {
  console.log("[begin] route middleware");
  await n();
  console.log("[end] route middleware");
};

/**
 * Simple greeting
 *   http://localhost:8000/hello-yourname
 */
app.get("/hello-{name}", (req: Request, res: Response) => {
  res.set(`Hello, ${req.param("name")} !`);
  throw new Error("Hello World!");
}, specificRouteMiddleware);

const corsOptions = {
  origin: "http://www.google.com",
  methods: "POST"
};

const testCorseCheck: CorsCallback = (req: Request, res: Response) => {
  console.log("test");
}

app.options("/cors", corsRoute(corsOptions, testCorseCheck));

app.post("/cors", (req: Request, res: Response) => {
  res.set("CORS allowed page");
}, cors(corsOptions));

/**
 * LET'S GO!!!
 */
app.listen({ port: 8000 });
