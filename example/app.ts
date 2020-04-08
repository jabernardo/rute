import { Rute, Request, Response, Middleware, Next } from "../mod.ts";

const app: Rute = new Rute()

app.static("./public");

app.use((req: Request, res: Response, next: Next) => {
  console.log("start");
  next();
  console.log("stop");
});

let d: Middleware = (req: Request, res: Response, n: Next) => {
    console.log('begin');
    console.log(req);
    n();
    console.log('end');
  };

app.addRoute(
    "GET",
    "/",
    (request: Request, response: Response) => {
      response.set({
        body: "Hi There!"
      });
    },
    d
  )

app.addRoute(
    ["GET", "POST"],
    "/categories/{category}/pages/{page}",
    (request: Request, response: Response) => {
      response.set("Hello World!");
    }
  );


app.listen({ port: 8000 });