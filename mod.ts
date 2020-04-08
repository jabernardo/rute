import { Route, Routes, RouteHandler } from "./route.ts";
import { test, getCleanPath, RouteData } from "./route_parser.ts";
import { serve, serveTLS, Server, ServerRequest, Response, HTTPOptions, HTTPSOptions } from "https://deno.land/std@v0.36.0/http/server.ts";
import { exists, existsSync } from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

import { MiddlewareContainer, Next, Middleware } from "./middleware.ts";
import { Request, parseHttpRequest } from "./request.ts";
import { MIME } from "./mime_types.ts";

export { Request, Response, Middleware, Next };

export interface RouteInfo {
  path: string,
  data: RouteData,
  route: Route
}

export class Rute extends MiddlewareContainer {
  private _routes: Routes = {};
  private _staticPaths: string[] = [];

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
    
    middlewares.forEach((middleware: Middleware) => {
      route.use(middleware);
    });

    this._routes[routePath] = route;
  }

  static(path: string) {
    this._staticPaths.push(path);
  }

  private _staticRender(url: string): Response | null {
    let i: number = 0;
    let filePath: string = url == "/" ? "./index.html" : `.${url}`;
    let filePathInfo = path.parse(filePath);

    // console.log(this._staticPaths, this._staticPaths.indexOf(filePathInfo.dir), existsSync(filePath));
    // console.log(MIME[filePathInfo.ext]);

    if (this._staticPaths.indexOf(filePathInfo.dir) > -1 && existsSync(filePath)) {
      let headers: Headers = new Headers();
      headers.append("content-type", MIME[filePathInfo.ext] || "application/octet-stream");

      return {
        status: 200,
        body: Deno.readFileSync(filePath),
        headers
      }
    }

    return null;
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

  async listen(addr: string | HTTPOptions | HTTPSOptions): Promise<void> {
    const s: Server = (typeof addr !== "string" && "certFile" in addr) 
      ? serveTLS(addr)
      : serve(addr);

    for await (const req of s) {
      let path: string = getCleanPath(req.url);
      let routeInfo: RouteInfo = await this.getRoute(path);
      let httpRequest: Request = await parseHttpRequest(req, routeInfo.data);
      let res:Response | null = this._staticRender(req.url);
      let answer: Response = this._default.execute(httpRequest);

      if (routeInfo.route != undefined) {
        this.go(() => {
          answer = this._staticRender(req.url) || routeInfo.route.execute(httpRequest);
        });
      }

      req.respond(answer);
    }
  }
}
