import {
  existsSync,
  denoPath,
} from "./deps.ts";

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
   * Check if path is a static path
   *
   * @param   {string}  filePath  File
   * @return  {boolean}
   */
  private _isStaticPath(filePath: string): boolean {
    for (let ind = 0; ind < this._staticPaths.length; ind++) {
      let pathTest: RegExp = new RegExp(`${this._staticPaths[ind]}(?:.*)`);
      if (pathTest.test(filePath)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get Handler Route
   *
   * @return  {Route} Static Route
   *
   */
  get handler(): Route {
    return new Route(
      "default",
      HTTP.ALL,
      (request: Request, response: Response) => {
        let i: number = 0;
        let urlWithoutParams = request.url.pathname.replace(/([#?].*)$/, "");
        let filePath: string = denoPath.normalize(`.${urlWithoutParams}`);
        let filePathInfo = denoPath.parse(filePath);

        if (isDirectory(filePath)) {
          filePath = denoPath.join(filePath, "index.html");
          filePathInfo = denoPath.parse(filePath);
        }

        if (
          this._isStaticPath(filePathInfo.dir) &&
          existsSync(filePath)
        ) {
          response
            .status(200)
            .header(
              "content-type",
              MIME[filePathInfo.ext] || "application/octet-stream",
            )
            .set(Deno.readFileSync(filePath));
          return;
        }

        response
          .status(404)
          .set(
            defaultPage(
              "404 Page not Found",
              "You're lost! The page you are looking for is not available.",
            ),
          );
      },
    );
  }
}
