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

  async use(fn: Middleware) {
    await super.use(fn);
  }

  get path(): string {
    return this._path;
  }

  get method(): string | Array<string> {
    return this._method;
  }

  async execute(httpRequest: Request, httpResponse: Response) {
    await this.go(httpRequest, httpResponse, async () => {
      if (this._method.indexOf(httpRequest.method) > -1)  {
        await this._handler(httpRequest, httpResponse);
      } else {
        httpResponse
          .status(404)
          .set("404 Page Not Found");
      }
    });
  }
}
