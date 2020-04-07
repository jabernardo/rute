export type Next = () => any;
export type Deferred = (n: Next) => any;

export class Middleware {
  use(fn: Deferred) {
    this.go = ((stack: Deferred) => (next: any) => stack(fn.bind(this, next.bind(this))))(this.go);
  }

  go:Deferred = (next: Next) => next();
}
