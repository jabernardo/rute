import { Request } from "./request.ts";
import { Response } from "./response.ts";

export type Next = () => any;
export type Middleware = (req: Request, res: Response, n: Next) => any;

export class MiddlewareContainer {
  /**
   * Use middleware
   *
   * @param   {Middleware}  fn  - Middleware function
   * @return  {void}        void
   */
  use(fn: Middleware): void {
    this.go = ((stack: Middleware) => async (request: Request, response: Response, next: Next) => await stack(request, response, fn.bind(this, request, response, next.bind(this))))(this.go);
  }

  /**
   * Run middleware stack
   *
   * @param {Request}   req - Request Object
   * @param {Response}  res - Response Object
   * @param {any}       any
   */
  async go(req: Request, res: Response, next: Next) {
    return await next();
  }
}
