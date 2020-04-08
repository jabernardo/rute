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

export class RequestParser {
  formData(data: string): RequestData {
    let params: RequestData = {};

    data.split("&").forEach(param => {
      let [ key, val ] = param.split("=");

      params[key] = val;
    });

    return params;
  }
}

export class Request {
  private _requestData: RequestInfo;
  private _parsedBody: JSON | RequestData;

  constructor(requestData: RequestInfo) {
    let parser: RequestParser = new RequestParser();

    this._requestData = requestData;
    this._parsedBody = JSON.parse("{}");

    try {
      this._parsedBody = JSON.parse(this._requestData.body);
    } catch {
       if (typeof requestData.body === "string" && this.is("x-www-form-urlencoded")) {
         this._parsedBody = parser.formData(requestData.body);
       }
    }
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

  is(contentType: string): boolean {
    let contentTypeTest: RegExp = new RegExp(`^.*/${ contentType.toLowerCase() }`);
    let header: string = this.header("content-type", "");
    console.log(header, contentTypeTest, contentTypeTest.test(header));
    return contentTypeTest.test(header);
  }

  header(key: string, fallback: any = null): string {
    return this._requestData.headers.get(key) || fallback;
  }

  body() {
    return this._parsedBody;
 }
}
