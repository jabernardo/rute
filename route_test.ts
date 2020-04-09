import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { Response } from "./response.ts";
import { Request, RequestInfo } from "./request.ts";

import { Route, RouteHandler } from "./route.ts";

Deno.test("[router: normal mode]", async function parseTest(): Promise<void> {
  const responseTest: Response = new Response();
  const requestInfo: RequestInfo = {
    url: new URL("http://localhost"),
    method: "GET",
    protocol: "HTTP/1.1",
    headers: new Headers(),
    body: undefined,
    query: {},
    params: {},
  }
  const requestTest: Request = new Request(requestInfo);

  const home: Route = new Route("/", "GET", (req: Request, res: Response) => {
    res.set("Hello World!");
  });

  home.execute(requestTest, responseTest);

  assertEquals(responseTest.raw().body,  "Hello World!");
  assertEquals(responseTest.raw().status,  200);
});
