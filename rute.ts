import { Route, Routes, RouteHandler } from "./route.ts";
import { test, getCleanPath, RouteData } from "./route_parser.ts";
import { serve, Server, ServerRequest, Response } from "https://deno.land/std@v0.36.0/http/server.ts";

import { Middleware, Next, Deferred } from "./middleware.ts";
import { Request } from "./request.ts";

export interface RouteInfo {
  path: string,
  data: RouteData,
  route: Route
}

export class Rute extends Middleware {
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

  addRoute(method: string | Array<string>, path: string, handler: RouteHandler): void {
    let routePath = path != "/" ? getCleanPath(path) : "/";

    this._routes[routePath] = new Route(path, method, handler);
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
      let httpRequest: Request = new Request(req);

      let answer: Response = this._default.execute(httpRequest);
      
      console.log(await httpRequest.body());

      if (routeInfo.route != undefined) {
        this.go(() => {
          httpRequest = new Request(req, routeInfo.data);
          answer = routeInfo.route.execute(httpRequest);
          console.log(answer);
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

app.addRoute(
    "GET",
    "/",
    <RouteHandler>(request: Request) => {
      return {
        body: "Hi There!"
      };
    }
  );

app.addRoute(
    "GET",
    "/categories/{category}/pages/{page}",
    <RouteHandler>(request: Request) => {
      console.log(request.params);
      return {
        body: "Boo!"
      };
    }
  );


app.listen(serve({ port: 8000 }));

console.log('test');
