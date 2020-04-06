import { ServerRequest, Response } from "https://deno.land/std@v0.36.0/http/server.ts";
import { RouteData } from "./route_parser.ts";

export type RouteHandler = (response: ServerRequest, data: RouteData) => Promise<Response> | Response;
