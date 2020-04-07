import { ServerRequest, Response } from "https://deno.land/std@v0.36.0/http/server.ts";
import { RouteData } from "./route_parser.ts";
import { Request } from "./request.ts";

export interface Routes {
  [path: string]: Route
}

export type RouteHandler = (request: Request) => Response;

// export interface Route {
//   method: string | Array<string>,
//   handler: RouteHandler
// }

export class Route {
  private _path: string;
  private _method: string | Array<string>;
  private _handler: RouteHandler;

  constructor(path: string, method: string | Array<string>, handler: RouteHandler) {
    this._path = path;
    this._method = method;
    this._handler = handler;
  }

  path(): string {
    return this._path;
  }

  method(): string | Array<string> {
    return this._method;
  }

  execute(httpRequest: Request): Response {
    if (this._method.indexOf(httpRequest.method) > -1)  {
      return this._handler(httpRequest);
    }

    return {};
  }
}
