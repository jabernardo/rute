import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { test } from "./route_parser.ts";

Deno.test("[router_parser: normal mode]", async function parseTest(): Promise<void> {
  const testRoute: string = "/categories/{category}/pages/{page}";
  const testPath: string = "/categories/books/pages/10";

  assertEquals(test(testRoute, testPath), { "category": "books", "page": "10" });

  const testRouteParam: string = "/categories/{category}/pages/{page}";
  const testPathParam: string = "/categories/books/pages/10/?test";

  assertEquals(test(testRouteParam, testPathParam), { "category": "books", "page": "10" });
});

Deno.test("[router_parser: regex mode]", async function parseTest(): Promise<void> {
  const testRoute: string = "/categories/{category}/pages/{page:([0-9]+)}";
  const testPath: string = "/categories/books/pages/10";

  assertEquals(test(testRoute, testPath), { "category": "books", "page": "10" });

  const testRouteParam: string = "/categories/{category}/pages/{page:([0-9]+)}";
  const testPathParam: string = "/categories/books/pages/10?hello#world";

  assertEquals(test(testRouteParam, testPathParam), { "category": "books", "page": "10" });
});
