import { Route, Routes, RouteHandler } from "./route.ts";
import { test, getCleanPath, RouteData } from "./route_parser.ts";
import { serve, Server, ServerRequest, Response } from "https://deno.land/std@v0.36.0/http/server.ts";

import { MiddlewareContainer, Next, Middleware } from "./middleware.ts";
import { Request, parseHttpRequest } from "./request.ts";

export interface RouteInfo {
  path: string,
  data: RouteData,
  route: Route
}

export class Rute extends MiddlewareContainer {
  private _routes: Routes = {};

  constructor() {
    super();
  }

  private _default: Route = new Route(
    "404",
    [ "GET", "POST", "DELETE", "UPDATE", "PUT", "OPTIONS", "HEAD" ],
    (request: Request) => {
      return {
        status: 404,
        body: "404 Page not Found"
      };
    }
  );

  addRoute(method: string | Array<string>, path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    let routePath = path != "/" ? getCleanPath(path) : "/";
    let route: Route = new Route(path, method, handler);

    // let m: Middleware = (n: Next) => {
    //   console.log('begin');
    //   n()
    //   console.log('end');
    // }

    middlewares.forEach((middleware: Middleware) => {
      route.use(middleware);
    });

    this._routes[routePath] = route;
  }

  async getRoute(url: string): Promise<RouteInfo> {
    let routeObj = this._routes["404"] || this._default;
    let data: RouteData | null = <RouteData>{};

    for (let route in this._routes) {
      data = test(route, url);

      if (data != null) {
        routeObj = this._routes[route];
        break;
      }
    }

    return new Promise((resolve, reject) => {
      resolve({
        path: url,
        data: data == null ? <RouteData>{} : data,
        route: routeObj
      });
    });
  }

  async listen(s: Server): Promise<void> {
    for await (const req of s) {
      let path: string = getCleanPath(req.url);
      let routeInfo: RouteInfo = await this.getRoute(path);
      let httpRequest: Request = await parseHttpRequest(req, routeInfo.data);

      let answer: Response = this._default.execute(httpRequest);

      if (routeInfo.route != undefined) {
        this.go(() => {
          answer = routeInfo.route.execute(httpRequest);
        });
      }

      req.respond(answer);
    }
  }
}

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
      console.log(request.body(), request.params());
      return {
        body: "Boo!"
      };
    }
  );


app.listen(serve({ port: 8000 }));

console.log('test');
