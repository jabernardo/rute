import { Route } from "./route.ts";
import { Routes } from "./routes.ts";
import { RouteHandler } from "./route_handler.ts";
import { test, getCleanPath, RouteData } from "./route_parser.ts";
import { serve, Server, ServerRequest, Response } from "https://deno.land/std@v0.36.0/http/server.ts";

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

  async getRoute(url: string): Promise<Route> {
    let defaultRoute = this._routes["404"] || this._default;

    for (let route in this._routes) {
      let data: RouteData | null = test(route, url);

      if (data != null) {
        defaultRoute = this._routes[route];
        break;
      }
    }

    return new Promise((resolve, reject) => {
      resolve(defaultRoute);
    });
  }

  async listen(s: Server): Promise<void> {
    for await (const req of s) {
      let path: string = getCleanPath(req.url);
      let route: Route = await this.getRoute(path);
      let answer: Response = await this._default.handler(req);

      if (route != undefined && route.method.indexOf(req.method) > -1) {
        answer = await route.handler(req);
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
    <RouteHandler>(request: ServerRequest) => {
      return new Promise((resolve, reject) => {
        resolve({body: "Boo!"});
      });
    }
  );


app.listen(serve({ port: 8000 }));

console.log('test');
