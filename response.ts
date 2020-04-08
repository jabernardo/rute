import { Response as HTTPResponse } from "https://deno.land/std@v0.36.0/http/server.ts";

export class Response {
  private _response: HTTPResponse = {};

  constructor(response: HTTPResponse = {}) {
    this._response = response;
  }

  set(response:  HTTPResponse) {
    this._response = response;
  }

  get(): HTTPResponse {
    return this._response;
  }
}
