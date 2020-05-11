import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { Response } from "./response.ts";

Deno.test("[router: normal mode]", async function parseTest(): Promise<void> {
  const responseTest: Response = new Response();

  responseTest
    .status(200)
    .cookie({name: "auth", value: "1234"})
    .set("Hello World!");

  assertEquals(responseTest.body, "Hello World!");
  assertEquals(responseTest.code, 200);
  assertEquals(responseTest.cookies, { "auth": "1234" });
});
