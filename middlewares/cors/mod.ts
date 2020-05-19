/**
 * TODO:
 *
 * - Code Cleanup
 * - Example
 *
 */

import { Middleware, Next } from "../../middleware.ts";
import { Request } from "../../request.ts";
import { Response } from "../../response.ts";

export type OriginList = string | string[] | RegExp | RegExp[];

export interface CorsOptions {
  origin: string | RegExp | OriginList;
  methods: string;
  status?: number;
  headers?: string[];
  exposeHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
  preflightContinue?: boolean;
}

export const defaultOptions: CorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  status: 200,
  preflightContinue: false,
};

export type CorsCallback = (req: Request, res: Response) => void;

function assertOrigin(origin: string, allowedOrigin: string | RegExp) {
  if (typeof allowedOrigin === "string" && allowedOrigin === "*") {
    allowedOrigin = new RegExp(".*");
  }

  if (allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(origin);
  }

  return origin === allowedOrigin;
}

function isOriginAllowed(origin: string, allowedOrigin: OriginList): boolean {
  if (!Array.isArray(allowedOrigin)) {
    return assertOrigin(origin, allowedOrigin);
  }

  for (let ind: number = 0; ind < allowedOrigin.length; ind++) {
    if (assertOrigin(origin, allowedOrigin[ind])) {
      return true;
    }
  }

  return false;
}

export function configureCors(
  req: Request,
  res: Response,
  options?: CorsOptions | undefined,
) {
  const httpOptions: CorsOptions = options || defaultOptions;

  const origin: string = req.headers.get("Origin") || "";
  const allowedOrigin: string = isOriginAllowed(origin, httpOptions.origin) ? (origin || "*") : "false";

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", httpOptions.methods);

    if (httpOptions.headers) {
      const corsHeaders: string = httpOptions.headers.join(",");
      res.header("Access-Control-Allow-Headers", corsHeaders);
    }

    if (httpOptions.maxAge) {
      res.header("Access-Control-Max-Age", httpOptions.maxAge.toString());
    }

    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Origin", allowedOrigin);

  if (httpOptions.exposeHeaders) {
    const corsExposeHeaders: string = httpOptions.exposeHeaders.join(",");
    res.header("Access-Control-Expose-Headers", corsExposeHeaders);
  }

  if (httpOptions.credentials) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
}

export function cors(options?: CorsOptions | undefined): Middleware {
  return async (req: Request, res: Response, n: Next) => {
    configureCors(req, res, options);

    if (res.headers.get("Access-Control-Allow-Origin") === "false") {
      res.header("Content-Length", "0");
      res.status(options?.status || 204);
      return;
    }

    if (req.method === "OPTIONS" && options?.preflightContinue) {
      await n();
      return;
    }

    await n();
  };
}
