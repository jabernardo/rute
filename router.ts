import { ServerRequest, Response as HTTPResponse, HTTPOptions, HTTPSOptions } from "https://deno.land/std@v0.41.0/http/server.ts";

import * as denoPath from "https://deno.land/std@v0.41.0/path/mod.ts";
import { exists, existsSync } from "https://deno.land/std@v0.41.0/fs/mod.ts";

import { Request, HTTP } from "./request.ts";
import { Response } from "./response.ts";
import { MiddlewareContainer, Next, Middleware } from "./middleware.ts";
import { test, getCleanPath, RouteData } from "./route_parser.ts";
import { Route, Routes, RouteHandler } from "./route.ts";
import { MIME } from "./mime_types.ts";

import { defaultPage } from "./utils/page.ts";

import { Rute} from "./server.ts";

export interface Rutes {
  [path: string]: Rute
}

export interface RouteInfo {
  path: string,
  data: RouteData,
  route: Route | Router | Rute
}

export interface Routers {
  [path: string]: Router
}

export class Router extends MiddlewareContainer {
  private _path: string;
  private _routes: Routes | Routers | Rutes = {};
  private _staticPaths: string[] = [];

  constructor(path: string = "/") {
    super();

    this._path = getCleanPath(path);
  }

  get path() {
    return this._path;
  }

  /**
   * Use middleware or application
   *
   * @param  fn   Middleware|Rute Middleware or sub-application
   * @return void
   *
   */
  use(fn: Middleware | Router | Rute): void {
    if (fn instanceof Rute || fn instanceof Router) {
      let appPath = getCleanPath(denoPath.join(this._path, fn.path));
      let appKey = `\\${appPath}`;

      if (typeof this._routes[appKey] !== "undefined") {
        throw new Error(`Can't use on "${appPath}" because route already exists.`);
      }

      this._routes[appKey] = fn;

      return;
    }

    super.use(fn);
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
      let filePathInfo = denoPath.parse(filePath);

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
    let routePath = getCleanPath(denoPath.join(this._path, path));
    let routeKey = `${method}\\${routePath}`;

    let route = new Route(path, method, handler);

    if (typeof this._routes[routeKey] !== "undefined") {
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
    let routeObj: Route = <Route>(this._routes["404"] || this._default);
    let data: RouteData | null = <RouteData>{};

    for (let route in this._routes) {
      let [ routeMethod, routePath ] = route.split("\\");

      let tempRoute: Route | Router | Rute = this._routes[route];

      if ((tempRoute instanceof Rute || tempRoute instanceof Router) && url.indexOf((<Rute>tempRoute).path) === 0) {
        return await tempRoute.getRoute(method, url);
      }

      data = test(routePath, url);

      if (data != null && (routeMethod.length === 0 || method == routeMethod)) {
        routeObj = <Route>tempRoute;
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
}
