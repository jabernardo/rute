import { Route, Routes, RouteHandler } from "./route.ts";
import { test, getCleanPath, RouteData } from "./route_parser.ts";
import { serve, serveTLS, Server, ServerRequest, Response as HTTPResponse, HTTPOptions, HTTPSOptions } from "https://deno.land/std@v0.41.0/http/server.ts";
import { Cookie } from "https://deno.land/std@v0.41.0/http/cookie.ts";

import { Router, RouteInfo } from "./router.ts";
import { Request, createFromDenoRequest, HTTP } from "./request.ts";
import { Response } from "./response.ts";
import { MiddlewareContainer, Next, Middleware } from "./middleware.ts";

import { Logger } from "./middlewares/logger.ts";

import { ruteLog } from "./utils/console.ts";

export { Router, Request, Response, Middleware, Next, Cookie, HTTP };

export interface Rutes {
  [path: string]: Rute
}

/**
 * Rute class application
 *
 */
export class Rute extends Router {
  private _name: string;

  constructor(name: string = "rute_app_1", path: string = "/") {
    super(path);

    this._name = name;

    this.use(Logger);
  }

  /**
   * Use middleware or application
   *
   * @param  fn   Middleware|Rute Middleware or sub-application
   * @return void
   *
   */
  use(fn: Middleware | Rute): void {
    super.use(fn);
  }

  /**
   * Get application name
   *
   * @return string Application name
   *
   */
  get name(): string {
    return this._name;
  }

  /**
   * Get application path
   *
   * @return string Application path
   *
   */
  get path(): string {
    return super.path;
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

    ruteLog("Listening on", addr);

    for await (const req of s) {
      let path: string = getCleanPath(req.url);
      let routeInfo: RouteInfo = await this.getRoute(req.method, path);
      let httpRequest: Request = await createFromDenoRequest(addr, req, routeInfo.data);
      let httpResponse: Response = new Response();

      await this.go(httpRequest, httpResponse, async () => {
        await (<Route>routeInfo.route).execute(httpRequest, httpResponse);
      });

      req.respond(httpResponse.deno);
    }
  }
}
