export type Next = () => any;
export type Middleware = (n: Next) => any;

export class MiddlewareContainer {
  use(fn: Middleware) {
    this.go = ((stack: Middleware) => (next: any) => stack(fn.bind(this, next.bind(this))))(this.go);
  }

  go:Middleware = (next: Next) => next();
}
