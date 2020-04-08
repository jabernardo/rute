import { Response as HTTPResponse } from "https://deno.land/std@v0.36.0/http/server.ts";

export class Response {
  private _status: number;
  private _body: Uint8Array | string;
  private _headers: Headers;

  constructor() {
    this._status = 200;
    this._body = "";
    this._headers = new Headers();
  }

  status(code: number): Response {
    this._status = code;
    return this;
  }

  headers(name: string, value: string): Response {
    this._headers.append(name, value);
    return this;
  }

  set(body: Uint8Array | object | string): Response {
    if (typeof body === "object" && !(body instanceof Uint8Array)) {
      this.headers("content-type", "application/json");
      this._body = JSON.stringify(body);
      
      return this;
    }

    this._body = body;
    return this;
  }

  get(): HTTPResponse {
    let headers: Headers = this._headers;

    return {
      status: this._status,
      body: this._body,
      headers
    };
  }
}
