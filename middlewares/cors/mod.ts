/**
 * TODO:
 *
 * - whitelisting
 * - multiple origin
 *
 */

import { Middleware, Next } from "../../middleware.ts";
import { Request } from "../../request.ts";
import { Response } from "../../response.ts";
import { RouteHandler } from "../../route.ts";

export interface CorsOptions {
  origin: string | RegExp,
  methods: string,
  status?: number,
  headers?: string[],
  exposeHeaders?: string[],
  credentials?: boolean,
  maxAge?: number,
}

export const defaultOptions: CorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  status: 200,
}

export type CorsCallback = (req: Request, res: Response) => void;

function isOriginAllowed(origin: string, allowedOrigin: string | RegExp): boolean {
  if (allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(origin);
  }

  return origin === allowedOrigin;
}

export function configureCors(req: Request, res: Response, options?: CorsOptions | undefined) {
  const httpOptions: CorsOptions = options || defaultOptions;
  const origin: string = req.headers.get("Origin") || "";
  const allowedOrigin: string = isOriginAllowed(origin, httpOptions.origin) ? origin : "false";

  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Methods", httpOptions.methods);

  if (httpOptions.headers) {
    const corsHeaders: string = httpOptions.headers.join(",");
    res.header("Access-Control-Allow-Headers", corsHeaders);
  }

  if (httpOptions.exposeHeaders) {
    const corsExposeHeaders: string = httpOptions.exposeHeaders.join(",");
    res.header("Access-Control-Expose-Headers", corsExposeHeaders);
  }

  if (httpOptions.credentials) {
    res.header("Access-Control-Allow-Credentials", "true");
  }

  if (httpOptions.maxAge) {
    res.header("Access-Control-Max-Age", httpOptions.maxAge.toString());
  }
}

export function corsRoute(options?: CorsOptions | undefined, callback?: CorsCallback): RouteHandler {
  return (req: Request, res: Response) => {
    configureCors(req, res, options);

    res.header("Content-Length", "0");
    res.status(options?.status || 204 );

    if (typeof callback !== "undefined") {
      callback(req, res);
    }
  };
}

export function cors(options?: CorsOptions | undefined): Middleware {
  return async (req: Request, res: Response, n: Next) => {
    configureCors(req, res, options);

    console.log(res.headers.get("Access-Control-Allow-Origin"));

    if (res.headers.get("Access-Control-Allow-Origin") === "false") {
        res.header("Content-Length", "0");
        res.status(options?.status || 204)
        return;
    }

    await n();
  }
}

// const corsOptions = {
//   origin: /(.*).mozilla.org/,
//   methods: "POST",
//   headers: ["apikey"],
//   exposeHeaders: ["test"],
//   maxAge: 10,
//   credentials: true
// };

// const testCorseCheck: CorsCallback = (req: Request, res: Response) => {
//   console.log("test");
// }

// app.options("/cors", corsRoute(corsOptions, testCorseCheck));

// app.post("/cors", (req: Request, res: Response) => {
//   res.set("CORS allowed page");
// }, cors(corsOptions));
