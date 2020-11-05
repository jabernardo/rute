import { denoPath } from "./deps.ts";

import { HTTP, Request } from "./request.ts";
import { Response } from "./response.ts";
import { Middleware, MiddlewareContainer } from "./middleware.ts";
import { getCleanPath, RouteData, test } from "./route_parser.ts";
import { Route, RouteHandler, Routes } from "./route.ts";
import { defaultPage } from "./utils/page.ts";

import { Server } from "./server.ts";

export interface Servers {
  [path: string]: Server;
}

export interface RouteInfo {
  path: string;
  data: RouteData;
  route: Route | Router | Server;
}

export interface Routers {
  [path: string]: Router;
}

export class Router extends MiddlewareContainer {
  private _path: string;
  private _routes: Routes | Routers | Servers = {};

  constructor(path: string = "/") {
    super();

    this._path = getCleanPath(path);
  }

  /**
   * Rebase router
   *
   * @param {string}  path  - URL Path
   *
   * @return Router
   *
   */
  rebase(path: string): Router {
    this._path = getCleanPath(path);

    return this;
  }

  /**
   * Get router path
   *
   * @return  {string}  Router Path
   *
   */
  get path() {
    return this._path;
  }

  /**
   * Use middleware or application
   *
   * @param {Middleware|Server} fn  - Middleware or sub-application
   * @return {void} void
   *
   */
  use(fn: Middleware | Router | Server): void {
    if (fn instanceof Server || fn instanceof Router) {
      let appPath = getCleanPath(denoPath.join(this._path, fn.path));
      let appKey = `|${appPath}`;

      if (typeof this._routes[appKey] !== "undefined") {
        throw new Error(
          `Can't use on "${appPath}" because route already exists.`,
        );
      }

      this._routes[appKey] = fn;

      return;
    }

    super.use(fn);
  }

  /**
   * Route path
   *
   * @param   {string}        method      - Request method
   * @param   {string}        path        - URL path
   * @param   {RounteHandler} handler     - Callback for route
   * @param   {Middleware[]}  middlewares - Route middlewares
   * @return  {void}          void
   *
   */
  route(
    method: string,
    path: string,
    handler: RouteHandler,
    ...middlewares: Middleware[]
  ): void {
    let routePath = getCleanPath(path);
    let routeKey = `${method}|${routePath}`;

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
   * @param   {string}        path         - URL Path
   * @param   {RouteHandler}  handler      - Callback for route
   * @param   {Middleware[]}  middlewares  - Route middlewares
   * @return  {void}          void
   *
   */
  all(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.ALL, path, handler, ...middlewares);
  }

  /**
   * GET Route
   *
   * @param   {string}        path         - URL Path
   * @param   {RouteHandler}  handler      - Callback for route
   * @param   {Middleware[]}  middlewares  - Route middlewares
   * @return  {void}          void
   *
   */
  get(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.GET, path, handler, ...middlewares);
  }

  /**
   * HEAD Route
   *
   * @param   {string}        path         - URL Path
   * @param   {RouteHandler}  handler      - Callback for route
   * @param   {Middleware[]}  middlewares  - Route middlewares
   * @return  {void}          void
   *
   */
  head(
    path: string,
    handler: RouteHandler,
    ...middlewares: Middleware[]
  ): void {
    this.route(HTTP.HEAD, path, handler, ...middlewares);
  }

  /**
   * POST Route
   *
   * @param   {string}        path         - URL Path
   * @param   {RouteHandler}  handler      - Callback for route
   * @param   {Middleware[]}  middlewares  - Route middlewares
   * @return  {void}          void
   *
   */
  post(
    path: string,
    handler: RouteHandler,
    ...middlewares: Middleware[]
  ): void {
    this.route(HTTP.POST, path, handler, ...middlewares);
  }

  /**
   * PUT Route
   *
   * @param   {string}        path         - URL Path
   * @param   {RouteHandler}  handler      - Callback for route
   * @param   {Middleware[]}  middlewares  - Route middlewares
   * @return  {void}          void
   *
   */
  put(path: string, handler: RouteHandler, ...middlewares: Middleware[]): void {
    this.route(HTTP.PUT, path, handler, ...middlewares);
  }

  /**
   * DELETE Route
   *
   * @param   {string}        path         - URL Path
   * @param   {RouteHandler}  handler      - Callback for route
   * @param   {Middleware[]}  middlewares  - Route middlewares
   * @return  {void}          void
   *
   */
  delete(
    path: string,
    handler: RouteHandler,
    ...middlewares: Middleware[]
  ): void {
    this.route(HTTP.DELETE, path, handler, ...middlewares);
  }

  /**
   * CONNECT Route
   *
   * @param   {string}        path         - URL Path
   * @param   {RouteHandler}  handler      - Callback for route
   * @param   {Middleware[]}  middlewares  - Route middlewares
   * @return  {void}          void
   *
   */
  connect(
    path: string,
    handler: RouteHandler,
    ...middlewares: Middleware[]
  ): void {
    this.route(HTTP.CONNECT, path, handler, ...middlewares);
  }

  /**
   * OPTIONS Route
   *
   * @param   {string}        path         - URL Path
   * @param   {Middleware[]}  middlewares  - Route middlewares
   * @return  {void}          void
   *
   */
  options(
    path: string,
    ...middlewares: Middleware[]
  ): void {
    const emptyRoute: RouteHandler = (req: Request, res: Response) => {};

    this.route(HTTP.OPTIONS, path, emptyRoute, ...middlewares);
  }

  /**
   * TRACE Route
   *
   * @param   {string}        path         - URL Path
   * @param   {RouteHandler}  handler      - Callback for route
   * @param   {Middleware[]}  middlewares  - Route middlewares
   * @return  {void}          void
   *
   */
  trace(
    path: string,
    handler: RouteHandler,
    ...middlewares: Middleware[]
  ): void {
    this.route(HTTP.TRACE, path, handler, ...middlewares);
  }

  /**
   * PATCH Route
   *
   * @param   {string}        path         - URL Path
   * @param   {RouteHandler}  handler      - Callback for route
   * @param   {Middleware[]}  middlewares  - Route middlewares
   * @return  {void}          void
   *
   */
  patch(
    path: string,
    handler: RouteHandler,
    ...middlewares: Middleware[]
  ): void {
    this.route(HTTP.PATCH, path, handler, ...middlewares);
  }

  /**
   * Get path route
   *
   * @param   {string}  method  - Request method
   * @param   {string}  url     - URL Path
   * @return  {Promise<RouteInfo>}  Promise<RouteInfo>
   *
   */
  async getRoute(method: string, url: string): Promise<RouteInfo> {
    let routeObj: Route = defaultPage;
    let data: RouteData | null = <RouteData> {};

    for (let route in this._routes) {
      const [routeMethod, routePath] = route.split("|");
      const joinedPath = getCleanPath(denoPath.join(this._path, routePath));

      let tempRoute: Route | Router | Server = this._routes[route];

      if (
        (tempRoute instanceof Server || tempRoute instanceof Router) &&
        url.indexOf(joinedPath) === 0
      ) {
        let fromAnother: RouteInfo = await tempRoute.rebase(joinedPath)
          .getRoute(method, url);

        return fromAnother;
      }

      data = test(joinedPath, url);

      if (
        tempRoute instanceof Route && data != null &&
        (routeMethod.length === 0 || method == routeMethod)
      ) {
        routeObj = <Route> tempRoute;
        break;
      }
    }

    return new Promise((resolve, reject) => {
      resolve({
        path: url,
        data: data == null ? <RouteData> {} : data,
        route: routeObj,
      });
    });
  }
}
