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
    n();
    console.log('end');
  };

app.add(
    "GET",
    "/",
    (request: Request, response: Response) => {
      console.log(request.body());
      
      response.set({
        body: "Hi There!"
      });
    },
    d
  )

app.add(
    ["GET", "POST"],
    "/categories/{category}/pages/{page}",
    (request: Request, response: Response) => {
      console.log(request.get("message"));
      console.log(request.getAll());

      response.set("Hello World!");
    }
  );


app.listen({ port: 8000 });