import { Response as HTTPResponse } from "https://deno.land/std@v0.36.0/http/server.ts";
import { Cookie, setCookie } from "https://deno.land/std/http/cookie.ts";

export class Response {
  private _status: number;
  private _body: Uint8Array | string;
  private _headers: Headers;
  private _cookieHandler: HTTPResponse;

  constructor() {
    this._status = 200;
    this._body = "";
    this._headers = new Headers();
    this._cookieHandler = {};
  }

  status(code: number): Response {
    this._status = code;
    return this;
  }

  header(name: string, value: string): Response {
    this._headers.append(name, value);
    return this;
  }

  cookie(cookie: Cookie): Response {
    setCookie(this._cookieHandler, cookie);

    return this;
  }

  set(body: Uint8Array | object | string): Response {
    if (typeof body === "object" && !(body instanceof Uint8Array)) {
      this.header("content-type", "application/json");
      this._body = JSON.stringify(body);
      
      return this;
    }

    this._body = body;
    return this;
  }

  raw(): HTTPResponse {
    let headers: Headers = this._headers;
    let cookieHeader: string = this._cookieHandler.headers ? this._cookieHandler.headers.get("set-cookie") || "" : "";

    headers.set("set-cookie", cookieHeader);

    return {
      status: this._status,
      body: this._body,
      headers
    };
  }
}
