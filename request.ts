import { ServerRequest } from "https://deno.land/std@v0.36.0/http/server.ts";
import { RouteData } from "./route_parser.ts";

/**
 * TODO:
 *  - Parse body
 *
 */

export interface RequestData {
  [key: string]: string;
}

export interface RequestInfo {
  url: string;
  method: string;
  protocol: string;
  headers: Headers;
  params: RouteData;
  body: string;
}

export async function parseHttpRequest(serverRequest: ServerRequest, params: RouteData =  <RouteData>{}): Promise<Request> {
  const body_raw =  new TextDecoder().decode(await Deno.readAll(serverRequest.body));

  const httpRequestContent: RequestInfo = {
    url: serverRequest.url,
    method: serverRequest.method,
    protocol: serverRequest.proto,
    headers: serverRequest.headers,
    body: body_raw,
    params: params,
  }

  return new Promise(resolve => {
    resolve(new Request(httpRequestContent));
  });
}

export class Request {
  private _requestData: RequestInfo;

  constructor(requestData: RequestInfo) {
    this._requestData = requestData;
  }

  params(key: string = "", fallback: any = null):any {
    if (key) {
      return this._requestData.params[key] || fallback;
    }

    return this._requestData.params;
  }

  protocol() {
    return this._requestData.protocol;
  }

  url() {
    return this._requestData.url;
  }

  method() {
    return this._requestData.method;
  }

  headers(key: string = "", fallback: any = null): Headers {
    if (key) {
      return this._requestData.headers.get(key) || fallback;
    }

    return this._requestData.headers;
  }

  body() {
   return this._requestData.body;
 }
}
