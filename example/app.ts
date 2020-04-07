import { serve } from "https://deno.land/std@v0.36.0/http/server.ts";
import { Rute, Request, Response, Middleware, Next } from "../rute.ts";

const app: Rute = new Rute()

app.use((next: Next) => {
  console.log("start");
  next();
  console.log("stop");
});

let d: Middleware = (n: Next) => {
    console.log('begin');
    n();
    console.log('end');
  };

app.addRoute(
    "GET",
    "/",
    (request: Request) => {
      return {
        body: "Hi There!"
      };
    },
    d, d
  )

app.addRoute(
    ["GET", "POST"],
    "/categories/{category}/pages/{page}",
    (request: Request) => {
      console.log(request.body(), request.params(), request.params("category"));
      console.log('---',request.headers().get('boo'));

      return {
        body: "Boo!"
      };
    }
  );


app.listen(serve({ port: 8000 }));