import { Rute, Request, Response, Middleware, Next } from "../mod.ts";

const app: Rute = new Rute()

app.static("./public");

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


app.listen({ port: 8000 });