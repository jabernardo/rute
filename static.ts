import { existsSync } from "https://deno.land/std/fs/exists.ts";
import * as denoPath from "https://deno.land/std/path/mod.ts";

import { Route } from "./route.ts";
import { Response } from "./response.ts";
import { Request, HTTP } from "./request.ts";
import { MIME } from "./mime_types.ts";

import { defaultPage } from "./utils/page.ts";
import { isDirectory } from "./utils/fs.ts";

export class Static {
  private _staticPaths: string[] = [];

  /**
   * Add static paths
   *
   * @param   {string}  path  Static path
   * @return  {void}    void
   */
  add(path: string): void {
    this._staticPaths.push(denoPath.normalize(path));
  }

  /**
   * Get Handler Route
   *
   * @return  {Route} Static Route
   *
   */
  get handler(): Route {
    return new Route("default", HTTP.ALL,
    (request: Request, response: Response) => {
      let i: number = 0;
      let urlWithoutParams = request.url.pathname.replace(/([#?].*)$/, "");
      let filePath: string = denoPath.normalize(`.${urlWithoutParams}`);
      let filePathInfo = denoPath.parse(filePath);

      if (isDirectory(filePath)) {
        filePath = denoPath.join(filePath, "index.html");
        filePathInfo = denoPath.parse(filePath);
      }

      if (this._staticPaths.indexOf(filePathInfo.dir) > -1 && existsSync(filePath)) {
        response
          .status(200)
          .header("content-type", MIME[filePathInfo.ext] || "application/octet-stream")
          .set(Deno.readFileSync(filePath))
         return
      }

      response
        .status(404)
        .set(
          defaultPage(
            "404 Page not Found",
            "You're lost! The page you are looking for is not available."
          )
        );
    });
  }
}
