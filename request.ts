import { ServerRequest, HTTPOptions, HTTPSOptions } from "https://deno.land/std@v0.41.0/http/server.ts";
import { Cookies, getCookies } from "https://deno.land/std@v0.41.0/http/cookie.ts";
import { RouteData } from "./route_parser.ts";

import Conn = Deno.Conn

export interface HTTPMethods {
  [key: string]: string;
}

export const HTTP: HTTPMethods = {
  ALL: "",
  GET: "GET",
  HEAD: "HEAD",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  CONNECT: "CONNECT",
  OPTIONS: "OPTIONS",
  TRACE: "TRACE",
  PATCH: "PATCH"
}

export interface RequestData {
  [key: string]: string;
}

export interface serverInfo {
  protocol: string,
  hostname: string,
  port: string | number,
  certFile?: string,
  keyFile?: string
}

/**
 * Parse Server Information ( string | HTTPOptions | HTTPSOptions -> serverInfo )
 *
 * @param   addr   string | HTTPOptions | HTTPSOptions   HTTP/HTTPS Information
 * @return  serverInfo
 *
 */
export function parseServerInfo(addr: string | HTTPOptions | HTTPSOptions): serverInfo {
  let [ hostname, port ] = (typeof addr === "string") 
    ? addr.split(":")
    : [ "hostname" in addr ? addr["hostname"] : "localhost", addr.port ];

  hostname = hostname || "localhost";

  const certFile =  (typeof addr === "object" && "certFile" in addr) ? addr["certFile"] : undefined;
  const keyFile =  (typeof addr === "object" && "keyFile" in addr) ? addr["keyFile"] : undefined;
  const protocol = certFile ? "https://" : "http://";

   return {
     protocol: protocol,
     hostname: hostname,
     port: port,
     certFile: certFile,
     keyFile: keyFile
   }
}

export interface RequestInfo {
  conn: Conn;
  url: URL;
  method: string;
  protocol: string;
  headers: Headers;
  cookies: Cookies;
  params: RouteData;
  query: RequestData;
  body: ArrayBuffer | ArrayBufferView | undefined;
}

/**
 * Create a new Request object based from Deno Request
 *
 * @param   addr   string | HTTPOptions | HTTPSOptions   HTTP/HTTPS Information
 * @return  Promise<Request> HTTP Request Object
 *
 */
export async function createFromDenoRequest(addr: string | HTTPOptions | HTTPSOptions, serverRequest: ServerRequest, params: RouteData =  <RouteData>{}): Promise<Request> {
  const body_raw =  await Deno.readAll(serverRequest.body);

  const { protocol, hostname, port } = parseServerInfo(addr);
  
  // TODO: Currently deno doesn't support auth with ServerRequest
  const hostUrlString = `${protocol}${hostname}${ port == "443" || port == "80" ? "" : ":" + port }${serverRequest.url}`;
  const hostUrl = new URL(hostUrlString);

  // TODO: Deno is checking for `cookie` instead of set-cookie
  serverRequest.headers.set("cookie", serverRequest.headers.get("set-cookie") || "");

  const httpRequestContent: RequestInfo = {
    conn: serverRequest.conn,
    url: hostUrl,
    method: serverRequest.method,
    protocol: serverRequest.proto,
    headers: serverRequest.headers,
    cookies: getCookies(serverRequest),
    body: body_raw,
    params: params,
    query: new RequestParser().urlSearchQuery(hostUrl.search)
  }

  return new Promise(resolve => {
    resolve(new Request(httpRequestContent));
  });
}

/**
 * Request Parser
 *  collection of supported request data formats
 * - URL Search Query
 * - FormData (URL Encoded)
 *
 */
export class RequestParser {
  /**
   * URL Search Query
   *
   * @param   data string Query String
   * @return  RequestData
   *
   */
  urlSearchQuery(data: string): RequestData {
    let params: RequestData = {};
    data = data[0] == "?" ? data.substr(1, data.length) : data;

    data.split("&").forEach(param => {
      let [ key, val ] = param.split("=");

      params[key] = val;
    });

    return params;
  }

  /**
   * FormData (URL Encoded)
   *
   * @param   data string Query String
   * @return  RequestData
   *
   */
  formDataUrlEncoded(data: string): RequestData {
    let params: RequestData = {};

    data.split("&").forEach(param => {
      let [ key, val ] = param.split("=");

      params[key] = val;
    });

    return params;
  }
}

/**
 * Rute HTTP Request Object
 *
 */
export class Request {
  private _requestData: RequestInfo;
  private _parsedBody: RequestData;

  /**
   * New HTTP Request
   *
   * @param   requestData   RequestInfo based from Deno HTTP Request
   *
   */
  constructor(requestData: RequestInfo) {
    let parser: RequestParser = new RequestParser();
    let textDecoder: TextDecoder = new TextDecoder()

    this._requestData = requestData;
    this._parsedBody = JSON.parse("{}");

    try {
      this._parsedBody = JSON.parse(textDecoder.decode(this._requestData.body));
    } catch {
       if (this.is("x-www-form-urlencoded")) {
         this._parsedBody = parser.formDataUrlEncoded(textDecoder.decode(requestData.body));
       }
    }
  }

  /**
   * URL Route Parameters
   *
   * @param   key       string    URL Pattern Key (default = "")
   * @param   fallback  any       Fallback value
   * @return  any
   *
   */
  params(key: string = "", fallback: any = null): any {
    if (key) {
      return this._requestData.params[key] || fallback;
    }

    return this._requestData.params;
  }

  /**
   * URL Search Query
   *
   * @param   key       string    URL Pattern Key (default = "")
   * @param   fallback  any       Fallback value
   * @return  any
   *
   */
  query(key: string = "", fallback: any = null): any {
    if (key) {
      return this._requestData.query[key] || fallback;
    }

    return this._requestData.query;
  }

  /**
   * Get request connection
   *
   * @return   Conn   Deno.Connection
   *
   */
  get connection() {
    return this._requestData.conn;
  }

  /**
   * Get request protocol
   *
   * @return string Request Protocol
   *
   */
  get protocol() {
    return this._requestData.protocol;
  }

  /**
   * Get request url
   *
   * @return string Request URL
   *
   */
  get url(): URL {
    return this._requestData.url;
  }

  /**
   * Get request method
   *
   * @return string Request method
   *
   */
  get method(): string {
    return this._requestData.method;
  }

  /**
   * Check if content-type is
   *
   * @param  contentType string MIME Type
   * @return boolean
   *
   */
  is(contentType: string): boolean {
    let contentTypeTest: RegExp = new RegExp(`^.*/${ contentType.toLowerCase() }`);
    let header: string = this.header("content-type", "");
    
    return contentTypeTest.test(header);
  }

  /**
   * Get request header
   *
   * @return string Request header
   *
   */
  header(key: string, fallback: any = null): string {
    return this._requestData.headers.get(key) || fallback;
  }

  /**
   * Get request cookie
   *
   * @return string Request cookie
   *
   */
  cookie(key: string, fallback: any = null): string {
    return this._requestData.cookies[key] || fallback;
  }

  /**
   * Get request body
   *
   * @return ArrayBuffer | ArrayBufferView | undefined Request body
   *
   */
  body(): ArrayBuffer | ArrayBufferView | undefined {
    return this._requestData.body;
  }

  /**
   * Get value from parsed request body
   *
   * @param name   string   Request name
   * @return any | null
   *
   */
  get(name: string): any | null {
    return this._parsedBody[name] || null;
  }

  /**
   * Get all parsed request body data
   *
   * @return RequestData
   *
   */
  getAll(): RequestData {
    return this._parsedBody;
  }
}
