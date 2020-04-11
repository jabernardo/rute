import { RouteData } from "./route_parser.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";
import { MiddlewareContainer, Middleware, Next } from "./middleware.ts";

export interface Routes {
  [path: string]: Route
}

/**
 * Route handler function
 *
 * @param  request   Request
 * @param  response  Response
 * @return void
 *
 */
export type RouteHandler = (request: Request, response: Response) => void;

/**
 * Route instance
 *
 */
export class Route extends MiddlewareContainer {
  private _path: string;
  private _method: string | Array<string>;
  private _handler: RouteHandler;

  /**
   * Create an instance of Route
   *
   * @param   path     string                  Route path
   * @param   method   string | Array<string>  HTTP Method
   * @param   hander   RouteHandler
   *
   */
  constructor(path: string, method: string | Array<string>, handler: RouteHandler) {
    super();

    this._path = path;
    this._method = method;
    this._handler = handler;
  }

  /**
   * Add middleware
   *
   * @example
   *
   *  const app = new Rute();
   *  app.use(async (req: Request, res: Response, n: Next) => {
   *    //...todo
   *  });
   *
   * @param   fn   Middleware   Middleware
   * @return  void
   *
   */
  use(fn: Middleware) {
    super.use(fn);
  }

  /**
   * Get route path
   *
   * @return   string
   *
   */
  get path(): string {
    return this._path;
  }

  /**
   * Get route HTTP method
   *
   * @return   string
   *
   */
  get method(): string | Array<string> {
    return this._method;
  }

  /**
   * Execute route
   *
   * @param   httpRequest   Request
   * @param   httpResponse  Reponse
   * @return  void
   *
   */
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
