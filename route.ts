import { Request } from "./request.ts";
import { Response } from "./response.ts";
import { MiddlewareContainer, Middleware, Next } from "./middleware.ts";

export interface Routes {
  [path: string]: Route
}

/**
 * Route handler function
 *
 * @param  {Request}  request   - Request
 * @param  {Respone}  response  - Response
 * @return {void}     void
 *
 */
export type RouteHandler = (request: Request, response: Response) => void;

/**
 * Route instance
 *
 */
export class Route extends MiddlewareContainer {
  private _path: string;
  private _method: string;
  private _handler: RouteHandler;

  /**
   * Create an instance of Route
   *
   * @param   {string}        path     - Route path
   * @param   {string}        method   - HTTP Method
   * @param   {RouteHandler}  hander   - RouteHandler
   *
   */
  constructor(path: string, method: string, handler: RouteHandler) {
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
   * @param   {Middleware}  fn  - Middleware
   * @return  {void}  void
   *
   */
  use(fn: Middleware) {
    super.use(fn);
  }

  /**
   * Get route path
   *
   * @return   {string} Route Path
   *
   */
  get path(): string {
    return this._path;
  }

  /**
   * Get route HTTP method
   *
   * @return   {string}   Route method
   *
   */
  get method(): string {
    return this._method;
  }

  /**
   * Execute route
   *
   * @param   {Request}   httpRequest   - Request
   * @param   {Response}  httpResponse  - Reponse
   * @return  {void}      void
   *
   */
  async execute(httpRequest: Request, httpResponse: Response) {
    await this.go(httpRequest, httpResponse, async () => {
      await this._handler(httpRequest, httpResponse);
    });
  }
}
