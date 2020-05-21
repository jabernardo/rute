import {
  Server,
  Request,
  Response,
} from "../../mod.ts";

import { logger } from "../../middlewares/logger/mod.ts";
import { cors } from "../../middlewares/cors/mod.ts";

const app: Server = new Server();

const corsOptions = {
  origin: [
    /http:\/\/localhost:*/,
    /www.gooogle.com/,
    /developers.mozilla.org/
  ],
  methods: "DELETE"
};

app.use(logger());

// Home
app.all("/", async (req: Request, res: Response) => {
  res.set(`
<!doctype html>
<html>
  <head>
    <title>CORS Example</title>
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
    <meta content="utf-8" http-equiv="encoding">
  </head>
  <body>
    <button onclick='fetch("http://localhost:8080/simple-cors", { method: "GET" }).then(res => res.text()).then(data => { alert(data) } );'>Test Simple CORS!</button>
    <button onclick='fetch("http://localhost:8080/cors", { method: "DELETE" }).then(res => res.text()).then(data => { alert(data) } );'>Test CORS!</button>
  </body>
</html>

  `).finalize();
});


// Basic CORS
app.get("/simple-cors", async (req: Request, res: Response) => {
  res.set("Simple CORS enabled page").finalize();
}, cors());

// Complex CORS with Preflight
app.options("/cors", cors(corsOptions));
app.delete("/cors", async (req: Request, res: Response) => {
  res.set("CORS enabled page").finalize();
}, cors(corsOptions));

app.listen({
  port: 8080
});
