import { Request } from "./request.ts";
import { Response } from "./response.ts";

export type Next = () => any;
export type Middleware = (req: Request, res: Response, n: Next) => any;

export class MiddlewareContainer {
  async use(fn: Middleware) {
    this.go = await ((stack: Middleware) => async (request: Request, response: Response, next: Next) => await stack(request, response, fn.bind(this, request, response, next.bind(this))))(this.go);
  }

  async go(req: Request, res: Response, next: Next) {
    return await next();
  }
}
