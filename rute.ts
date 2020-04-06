import { Route } from "./route.ts";
import { Routes } from "./routes.ts";
import { RouteHandler } from "./route_handler.ts";
import { test, getCleanPath, RouteData } from "./route_parser.ts";
import { serve, Server, ServerRequest, Response } from "https://deno.land/std@v0.36.0/http/server.ts";

import { Request } from "./request.ts";

export interface RouteInfo {
  path: string,
  data: RouteData,
  route: Route
}

export class Rute {
  private _routes: Routes = {};

  private _default: Route = <Route>{
    method: [ "GET", "POST", "DELETE", "UPDATE", "PUT", "OPTIONS", "HEAD" ],
    handler: (request: Request) => {
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
      let httpRequest: Request = new Request(req);

      let answer: Response = await this._default.handler(httpRequest);
      
      console.log(await httpRequest.body());

      if (routeInfo.route != undefined && routeInfo.route.method.indexOf(req.method) > -1) {
        httpRequest = new Request(req, routeInfo.data);
        answer = await routeInfo.route.handler(httpRequest);
      }

      req.respond(answer);
    }
  }
}

const app: Rute = new Rute()
app.addRoute(
    "GET",
    "/",
    <RouteHandler>(request: Request) => {
      return new Promise((resolve, reject) => {
        resolve({body: "Hi There!"});
      });
    }
  );

app.addRoute(
    "GET",
    "/categories/{category}/pages/{page}",
    <RouteHandler>(request: Request) => {
      console.log(request.params);
      return new Promise((resolve, reject) => {
        resolve({body: "Boo!"});
      });
    }
  );


app.listen(serve({ port: 8000 }));

console.log('test');
