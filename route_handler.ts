import { ServerRequest, Response } from "https://deno.land/std@v0.36.0/http/server.ts";
import { RouteData } from "./route_parser.ts";
import { Request } from "./request.ts";

export type RouteHandler = (request: Request) => Promise<Response> | Response;
