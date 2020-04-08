import { RouteData } from "./route_parser.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";
import { MiddlewareContainer, Middleware, Next } from "./middleware.ts";

export interface Routes {
  [path: string]: Route
}

export type RouteHandler = (request: Request, response: Response) => void;

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

  execute(httpRequest: Request, httpResponse: Response): Response {
    if (this._method.indexOf(httpRequest.method()) > -1)  {
      this.go(httpRequest, httpResponse, () => {
        this._handler(httpRequest, httpResponse);
      });
    }

    return httpResponse;
  }
}
