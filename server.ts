import { serve, serveTLS, Server as HTTPServer, ServerRequest, Response as HTTPResponse, HTTPOptions, HTTPSOptions } from "https://deno.land/std/http/server.ts";
import * as denoPath from "https://deno.land/std/path/mod.ts";

import { RouteInfo, Router } from "./router.ts";
import { Route } from "./route.ts";
import { Middleware, Next } from "./middleware.ts";
import { Request, createFromDenoRequest, HTTP } from "./request.ts";
import { Response } from "./response.ts";
import { getCleanPath } from "./route_parser.ts";

import { Logger } from "./middlewares/logger.ts";

import { log } from "./utils/console.ts";

export { Router, Request, Response, Middleware, Next, HTTP }

/**
 * Server class application
 *
 */
export class Server extends Router {
  private _name: string;

  constructor(name: string = "rute_app_1", path: string = "/") {
    super(path);

    this._name = name;

    this.use(Logger);
  }

  /**
   * Use middleware or application
   *
   * @param  {Middleware|Server}  fn  - Middleware or sub-application
   * @return {void} void
   *
   */
  use(fn: Middleware | Router | Server): void {
    if (fn instanceof Router || fn instanceof Server) {
      fn.rebase(denoPath.join(this.path, fn.path));
    }

    super.use(fn);

    log(`[${this.name}]`.bgBlue().white(), "Attached".green(), (fn instanceof Router || fn instanceof Server) ? fn.path : fn.constructor.name);
  }

  /**
   * Rebase router
   *
   * @param {string}  path  - URL Path
   *
   * @return {Server} Server Instance
   *
   */
  rebase(path: string): Server {
    super.rebase(path);

    return this;
  }

  /**
   * Get application name
   *
   * @return  {string}  - Application name
   *
   */
  get name(): string {
    return this._name;
  }

  /**
   * Get application path
   *
   * @return  {string}  - Application path
   *
   */
  get path(): string {
    return super.path;
  }

  /**
   * Get host URL string
   *
   * @param {string | HTTPOptions | HTTPSOptions} addr - Connection information
   *
   * @return {string}   Human readable connection string
   *
   */
  private _getConnectionString(addr: string | HTTPOptions | HTTPSOptions): string {
    if (typeof addr === "string") return addr;

    const hostname =
      (typeof addr === "object" && "hostname" in addr) ? (<HTTPOptions>addr).hostname : "localhost";

    const port =
      (typeof addr === "object" && "port" in addr) ? (<HTTPOptions>addr).port : "";

    const protocol =
      (typeof addr === "object" && "certFile" in addr) ? "https" : "http";

    return `${protocol}://${hostname}:${port}/`;
  }

  /**
   * Serve and listen
   *
   * To enable TLS and another options
   * see: https://deno.land/std/http/
   *
   * @example
   *    const app = new Server();
   *    app.listen("80")
   *
   * @param   {string | HTTPOptions | HTTPSOptions} addr  - Connection Information
   * @return  {Promise<void>}
   *
   */
  async listen(addr: string | HTTPOptions | HTTPSOptions): Promise<void> {
    const s: HTTPServer = (typeof addr !== "string" && "certFile" in addr)
      ? serveTLS(addr)
      : serve(addr);

    log(`[${this.name}]`.bgGreen().white(), `Listening on`.green(), this._getConnectionString(addr));

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