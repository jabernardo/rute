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
import { Logger } from "./middlewares/logger.ts";

import { defaultPage } from "./utils/page.ts";

export { Request, Response, Middleware, Next, Cookie, HTTP };

export interface RouteInfo {
  path: string,
  data: RouteData,
  route: Route
}

/**
 * Rute class application
 *
 */
export class Rute extends MiddlewareContainer {
  private _routes: Routes = {};
  private _staticPaths: string[] = [];

  constructor() {
    super();

    this.use(Logger);
  }

  /**
   * Static handler
   *
   * @type Route
   *
   */
  private _default: Route = new Route("default", HTTP.ALL,
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
        .set(defaultPage("404 Page not Found", "You're lost! The page you are looking for is not available."));
    }
  );

  /**
   * Route path
   *
   * @param   method       string Request method
   * @param   path         string                 URL path
   * @param   handler      RouteHandler           Callback for route
   * @param   middlewares  Middleware[]           Route middlewares
   * @return  void
   *
   */
  route(method: string, path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    let routePath = path != "/" ? getCleanPath(path) : "/";
    let route: Route = new Route(path, method, handler);
    let routeKey = `${method}\\${routePath}`;

    if (typeof this._routes[routeKey] !== "undefined"){
      throw new Error(`${routePath} already exists.`);
    }

    middlewares.forEach((middleware: Middleware) => {
      route.use(middleware);
    });

    this._routes[routeKey] = route;
  }

  /**
   * ALL Route
   *
   * @param   path         string         URL Path
   * @param   handler      RouteHandler   Callback for route
   * @param   middlewares  Middleware[]   Route middlewares
   * @return  void
   *
   */
  all(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.ALL, path, handler, ...middlewares);
  }

  /**
   * GET Route
   *
   * @param   path         string         URL Path
   * @param   handler      RouteHandler   Callback for route
   * @param   middlewares  Middleware[]   Route middlewares
   * @return  void
   *
   */
  get(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.GET, path, handler, ...middlewares);
  }

  /**
   * HEAD Route
   *
   * @param   path         string         URL Path
   * @param   handler      RouteHandler   Callback for route
   * @param   middlewares  Middleware[]   Route middlewares
   * @return  void
   *
   */
  head(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.HEAD, path, handler, ...middlewares);
  }

  /**
   * POST Route
   *
   * @param   path         string         URL Path
   * @param   handler      RouteHandler   Callback for route
   * @param   middlewares  Middleware[]   Route middlewares
   * @return  void
   *
   */
  post(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.POST, path, handler, ...middlewares);
  }

  /**
   * PUT Route
   *
   * @param   path         string         URL Path
   * @param   handler      RouteHandler   Callback for route
   * @param   middlewares  Middleware[]   Route middlewares
   * @return  void
   *
   */
  put(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.PUT, path, handler, ...middlewares);
  }

  /**
   * DELETE Route
   *
   * @param   path         string         URL Path
   * @param   handler      RouteHandler   Callback for route
   * @param   middlewares  Middleware[]   Route middlewares
   * @return  void
   *
   */
  delete(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.DELETE, path, handler, ...middlewares);
  }

  /**
   * CONNECT Route
   *
   * @param   path         string         URL Path
   * @param   handler      RouteHandler   Callback for route
   * @param   middlewares  Middleware[]   Route middlewares
   * @return  void
   *
   */
  connect(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.CONNECT, path, handler, ...middlewares);
  }

  /**
   * OPTIONS Route
   *
   * @param   path         string         URL Path
   * @param   handler      RouteHandler   Callback for route
   * @param   middlewares  Middleware[]   Route middlewares
   * @return  void
   *
   */
  options(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.OPTIONS, path, handler, ...middlewares);
  }

  /**
   * TRACE Route
   *
   * @param   path         string         URL Path
   * @param   handler      RouteHandler   Callback for route
   * @param   middlewares  Middleware[]   Route middlewares
   * @return  void
   *
   */
  trace(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.TRACE, path, handler, ...middlewares);
  }

  /**
   * PATCH Route
   *
   * @param   path         string         URL Path
   * @param   handler      RouteHandler   Callback for route
   * @param   middlewares  Middleware[]   Route middlewares
   * @return  void
   *
   */
  patch(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.PATCH, path, handler, ...middlewares);
  }

  /**
   * Add static path
   *
   * @example
   *
   *   const app = new Rute();
   *   app.static("./static");
   *
   * @param   path   string   Folder path
   * @return  void
   *
   */
  static(path: string) {
    this._staticPaths.push(path);
  }

  /**
   * Get path route
   *
   * @param   method  string   Request method
   * @param   url     string   URL Path
   * @return  Promise<RouteInfo>
   *
   */
  async getRoute(method: string, url: string): Promise<RouteInfo> {
    let routeObj = this._routes["404"] || this._default;
    let data: RouteData | null = <RouteData>{};

    for (let route in this._routes) {
      let [ routeMethod, routePath ] = route.split("\\");

      data = test(routePath, url);

      if (data != null && (routeMethod.length === 0 || method == routeMethod)) {
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

  /**
   * Serve and listen
   *
   * To enable TLS and another options
   * see: https://deno.land/std/http/
   * 
   * @example
   *    const app = new Rute();
   *    app.listen("80")
   *
   * @param   addr  string | HTTPOptions | HTTPSOptions
   * @return  Promise<void>
   *
   */
  async listen(addr: string | HTTPOptions | HTTPSOptions): Promise<void> {
    const s: Server = (typeof addr !== "string" && "certFile" in addr) 
      ? serveTLS(addr)
      : serve(addr);

    console.log(`[rute] Listening on`, addr);

    for await (const req of s) {
      let path: string = getCleanPath(req.url);
      let routeInfo: RouteInfo = await this.getRoute(req.method, path);
      let httpRequest: Request = await parseHttpRequest(addr, req, routeInfo.data);
      let httpResponse: Response = new Response();

      await this.go(httpRequest, httpResponse, async () => {
        await routeInfo.route.execute(httpRequest, httpResponse);
      });

      req.respond(httpResponse.compile());
    }
  }
}
