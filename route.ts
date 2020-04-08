import { ServerRequest, Response } from "https://deno.land/std@v0.36.0/http/server.ts";
import { RouteData } from "./route_parser.ts";
import { Request } from "./request.ts";
import { MiddlewareContainer, Middleware, Next } from "./middleware.ts";

export interface Routes {
  [path: string]: Route
}

export type RouteHandler = (request: Request) => Response;

export class Route extends MiddlewareContainer {
  private _path: string;
  private _method: string | Array<string>;
  private _handler: RouteHandler;

  constructor(path: string, method: string | Array<string>, handler: RouteHandler) {
    super();

    this._path = path;
    this._method = method;
    this._handler = handler;
  }

  use(fn: Middleware): Route {
    super.use(fn);

    return this;
  }

  path(): string {
    return this._path;
  }

  method(): string | Array<string> {
    return this._method;
  }

  execute(httpRequest: Request): Response {
    let answer: Response = {};

    if (this._method.indexOf(httpRequest.method()) > -1)  {
      this.go(() => {
        answer = this._handler(httpRequest);
      });
    }

    return answer;
  }
}
