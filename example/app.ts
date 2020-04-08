import { Rute, Request, Response, Middleware, Next } from "../mod.ts";

const app: Rute = new Rute()

app.static("./public");

app.use((req: Request, next: Next) => {
  console.log("start");
  next(req);
  console.log("stop");
});

let d: Middleware = (req: Request, n: Next) => {
    console.log('begin');
    console.log(req);
    n(req);
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
    d
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