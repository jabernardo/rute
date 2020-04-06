import { Route } from "./route.ts";
import { Routes } from "./routes.ts";
import { RouteHandler } from "./route_handler.ts";
import { test, getCleanPath, RouteData } from "./route_parser.ts";
import { serve, Server, ServerRequest, Response } from "https://deno.land/std@v0.36.0/http/server.ts";


export interface RouteInfo {
  path: string,
  data: RouteData,
  route: Route
}

export class Rute {
  _routes: Routes = {};

  _default: Route = <Route>{
    method: [ "GET", "POST", "DELETE", "UPDATE", "PUT", "OPTIONS", "HEAD" ],
    handler: (request: ServerRequest) => {
      return new Promise((resolve, reject) => {
        resolve({
          status: 404,
          body: "404 Page not Found"
        })
      });
    }
  }

  addRoute(method: string | Array<string>, path: string, handler: RouteHandler): void {
    let routePath = path != "/" ? getCleanPath(path) : "/";

    this._routes[routePath] = {
      method: method,
      handler: handler
    }
  }

  async getRoute(url: string): Promise<RouteInfo> {
    let callback = this._routes["404"] || this._default;
    let data: RouteData | null = <RouteData>{};

    for (let route in this._routes) {
      data = test(route, url);

      if (data != null) {
        callback = this._routes[route];
        break;
      }
    }

    return new Promise((resolve, reject) => {
      resolve({
        path: url,
        data: data == null ? <RouteData>{} : data,
        route: callback
      });
    });
  }

  async listen(s: Server): Promise<void> {
    for await (const req of s) {
      let path: string = getCleanPath(req.url);
      let routeInfo: RouteInfo = await this.getRoute(path);
      let answer: Response = await this._default.handler(req, <RouteData>{});

      if (routeInfo.route != undefined && routeInfo.route.method.indexOf(req.method) > -1) {
        answer = await routeInfo.route.handler(req, routeInfo.data);
      }

      req.respond(answer);
    }
  }
}

const app: Rute = new Rute()
app.addRoute(
    "GET",
    "/",
    <RouteHandler>(request: ServerRequest) => {
      return new Promise((resolve, reject) => {
        resolve({body: "Hi There!"});
      });
    }
  );

app.addRoute(
    "GET",
    "/categories/{category}/pages/{page}",
    <RouteHandler>(request: ServerRequest, data: RouteData) => {
      console.log(data);
      return new Promise((resolve, reject) => {
        resolve({body: "Boo!"});
      });
    }
  );


app.listen(serve({ port: 8000 }));

console.log('test');
