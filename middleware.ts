import { Request } from "./request.ts";
import { Response } from "./response.ts";

export type Next = () => any;
export type Middleware = (req: Request, res: Response, n: Next) => any;

export class MiddlewareContainer {
  use(fn: Middleware) {
    this.go = ((stack: Middleware) => (request: Request, response: Response, next: Next) => stack(request, response, fn.bind(this, request, response, next.bind(this))))(this.go);
  }

  go:Middleware = (req: Request, res: Response, next: Next) => next();
}
