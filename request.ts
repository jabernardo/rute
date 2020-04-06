import { ServerRequest } from "https://deno.land/std@v0.36.0/http/server.ts";
import { RouteData } from "./route_parser.ts";

/**
 * TODO:
 *  - Parse body
 *
 */

export class Request {
  url!: string;
  method!: string;
  protocol!: string;
  headers!: Headers;
  params!: RouteData;

  private _body: Deno.Reader;

  constructor(serverRequest: ServerRequest, params: RouteData =  <RouteData>{}) {
    this.url = serverRequest.url;
    this.method = serverRequest.method;
    this.protocol = serverRequest.proto;
    this.headers = serverRequest.headers;
    this._body = serverRequest.body;
    this.params = params;
  }

  async body(): Promise<any> {
    const body =  new TextDecoder().decode(await Deno.readAll(this._body));

    return new Promise((resolve, reject) => {
      resolve(body);
    });
  }

}

