import { Response as HTTPResponse, ServerRequest } from "https://deno.land/std/http/server.ts";
import { Cookie, Cookies, setCookie, getCookies } from "https://deno.land/std/http/cookie.ts";

/**
 * Response Object
 *
 */
export class Response {
  private _status: number;
  private _body: Uint8Array | string;
  private _headers: Headers;
  private _cookieHandler: HTTPResponse;

  /**
   * New Response Object
   *
   */
  constructor() {
    this._status = 200;
    this._body = "";
    this._headers = new Headers();
    this._cookieHandler = {};
  }

  /**
   * Set Status Code
   *
   * @param   {number}    code  - Status Code
   * @return  {Response}  Response instance
   *
   */
  status(code: number): Response {
    this._status = code;
    return this;
  }

  /**
   * Get current status code
   *
   * @return {number}   Status Code
   *
   */
  get code(): number {
    return this._status;
  }

  /**
   * Set Header
   *
   * @param   {string}  name   - header name
   * @param   {string}  value  - value
   * @return  {Response}  Response instance
   *
   */
  header(name: string, value: string): Response {
    this._headers.append(name, value);
    return this;
  }

  /**
   * Get response headers
   *
   * @return   {Headers}  Response Headers
   *
   */
  get headers(): Headers {
    return this._headers;
  }

  /**
   * Set Cookie
   *
   * @param   {Cookie}  cookie  - Cookie object
   * @return  {Reponse} Response instance
   *
   */
  cookie(cookie: Cookie): Response {
    setCookie(this._cookieHandler, cookie);

    return this;
  }

  /**
   * Get Cookies
   *
   * @return {Cookies}  Response cookies
   *
   */
  get cookies(): Cookies {
    let request = new ServerRequest();
    request.headers = this._cookieHandler.headers || new Headers();
    request.headers.set("cookie", request.headers.get("set-cookie") || "");

    return getCookies(request);
  }

  /**
   * Set response body
   *
   * @param   {Uint8Array | object | string}  body  - Response Body
   * @return  {Response}  Response instance
   *
   */
  set(body: Uint8Array | object | string): Response {
    if (typeof body === "object" && !(body instanceof Uint8Array)) {
      this.header("content-type", "application/json");
      this._body = JSON.stringify(body);

      return this;
    }

    this._body = body;
    return this;
  }

  /**
   * Get response body
   *
   * @return  {Uint8Array | string} Response body
   *
   */
  get body(): Uint8Array | string {
    return this._body;
  }

  /**
   * To Deno Response
   *
   * @return {HTTPResponse} HTTP Response
   *
   */
  get deno(): HTTPResponse {
    let headers: Headers = this._headers;
    let cookieHeader: string = this._cookieHandler.headers ? this._cookieHandler.headers.get("set-cookie") || "" : "";

    headers.set("set-cookie", cookieHeader);

    let compiledResponse: HTTPResponse = {
      status: this._status,
      headers
    };

    if (this._body) {
      compiledResponse.body = this._body;
    }

    return compiledResponse;
  }
}
