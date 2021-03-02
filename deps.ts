// Import: Deno HTTP Modules
export {
  serve,
  serveTLS,
  Server as HTTPServer,
  ServerRequest,
} from "https://deno.land/std@0.88.0/http/server.ts";

export type {
  Response,
  HTTPOptions,
  HTTPSOptions,
} from "https://deno.land/std@0.88.0/http/server.ts";

// Import: Deno HTTP Cookie Modules
export {
  setCookie,
  getCookies,
  deleteCookie,
} from "https://deno.land/std@0.88.0/http/cookie.ts";

export type { Cookie } from "https://deno.land/std@0.88.0/http/cookie.ts";

// Import: Deno Testing Modules
export { assertEquals } from "https://deno.land/std@0.88.0/testing/asserts.ts";

// Import: Deno Path Modules
export * as denoPath from "https://deno.land/std@0.88.0/path/mod.ts";

// Import: Deno FS Modules
export { existsSync } from "https://deno.land/std@0.88.0/fs/exists.ts";

// Import: Global from strcolors.ts
export * from "https://deno.land/x/strcolors.ts@0.1/mod.ts";
