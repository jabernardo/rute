import { RouteHandler } from "./route_handler.ts";

export interface Route {
  method: string | Array<string>,
  handler: RouteHandler
}
