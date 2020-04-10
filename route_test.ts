import { assertEquals } from "https://deno.land/std@v0.39.0/testing/asserts.ts";

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
    cookies:  {},
    body: undefined,
    query: {},
    params: {},
  }
  const requestTest: Request = new Request(requestInfo);

  const home: Route = new Route("/", "GET", (req: Request, res: Response) => {
    res.cookie({ name: "auth", value: "1234" });
    res.set("Hello World!");
  });

  home.execute(requestTest, responseTest);

  assertEquals(responseTest.body, "Hello World!");
  assertEquals(responseTest.code, 200);
  assertEquals(responseTest.cookies, { "auth": "1234" });
});
