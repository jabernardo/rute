import { Request } from "./request.ts";

export type Next = (req: Request) => any;
export type Middleware = (req: Request, n: Next) => any;

export class MiddlewareContainer {
  use(fn: Middleware) {
    this.go = ((stack: Middleware) => (request: Request, next: Next) => stack(request, fn.bind(this, request, next.bind(this))))(this.go);
  }

  go:Middleware = (req: Request, next: Next) => next(req);
}
