import { Route, Routes, RouteHandler } from "./route.ts";
import { test, getCleanPath, RouteData } from "./route_parser.ts";
import { serve, serveTLS, Server, ServerRequest, Response as HTTPResponse, HTTPOptions, HTTPSOptions } from "https://deno.land/std@v0.39.0/http/server.ts";
import { exists, existsSync } from "https://deno.land/std@v0.39.0/fs/mod.ts";
import { Cookie } from "https://deno.land/std@v0.39.0/http/cookie.ts";
import * as path from "https://deno.land/std@v0.39.0/path/mod.ts";

import { MiddlewareContainer, Next, Middleware } from "./middleware.ts";
import { Request, parseHttpRequest, HTTP } from "./request.ts";
import { Response } from "./response.ts";
import { MIME } from "./mime_types.ts";

export { Request, Response, Middleware, Next, Cookie, HTTP };

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
    [ HTTP.GET, HTTP.HEAD, HTTP.POST, HTTP.PUT, HTTP.DELETE, HTTP.DELETE, HTTP.CONNECT, HTTP.OPTIONS, HTTP.TRACE, HTTP.PATCH ],
    (request: Request, response: Response) => {
      let i: number = 0;
      let urlWithoutParams = request.url.pathname.replace(/([#?].*)$/, "");
      let filePath: string = request.url.pathname == "/" ? "./index.html" : `.${urlWithoutParams}`;
      let filePathInfo = path.parse(filePath);

      if (this._staticPaths.indexOf(filePathInfo.dir) > -1 && existsSync(filePath)) {
        response
          .status(200)
          .header("content-type", MIME[filePathInfo.ext] || "application/octet-stream")
          .set(Deno.readFileSync(filePath))
         return 
      }

      response
        .status(404)
        .set("404 Page not Found");
    }
  );

  route(method: string | Array<string>, path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    let routePath = path != "/" ? getCleanPath(path) : "/";
    let route: Route = new Route(path, method, handler);

    middlewares.forEach((middleware: Middleware) => {
      route.use(middleware);
    });

    this._routes[routePath] = route;
  }

  get(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.GET, path, handler, ...middlewares);
  }

  head(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.HEAD, path, handler, ...middlewares);
  }

  post(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.POST, path, handler, ...middlewares);
  }

  put(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.PUT, path, handler, ...middlewares);
  }

  delete(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.DELETE, path, handler, ...middlewares);
  }

  connect(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.CONNECT, path, handler, ...middlewares);
  }

  options(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.OPTIONS, path, handler, ...middlewares);
  }

  trace(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.TRACE, path, handler, ...middlewares);
  }

  patch(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.PATCH, path, handler, ...middlewares);
  }

  static(path: string) {
    this._staticPaths.push(path);
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
      let httpRequest: Request = await parseHttpRequest(addr, req, routeInfo.data);
      let httpResponse: Response = new Response();

      await this.go(httpRequest, httpResponse, async () => {
        await routeInfo.route.execute(httpRequest, httpResponse);
      });

      req.respond(httpResponse.compile());
    }
  }
}
