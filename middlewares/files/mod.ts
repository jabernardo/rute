import "../../deps.ts";

import { denoPath, existsSync } from "../../deps.ts";

import { isDirectory } from "../../utils/fs.ts";
import { Middleware, Next } from "../../middleware.ts";
import { Request } from "../../request.ts";
import { Response } from "../../response.ts";
import { MIME } from "../../mime_types.ts";

/**
 * Static File Handler Middleware
 *
 * @param {string}  path  Folder path
 */
export function files(path: string): Middleware {
  return async (req: Request, res: Response, n: Next) => {
    await n();

    if (res.code === 404) {
      let urlWithoutParams = req.url.pathname.replace(/([#?].*)$/, "");
      let filePath: string = denoPath.join(denoPath.normalize(`${path}`), urlWithoutParams);
      let filePathInfo = denoPath.parse(filePath);

      if (isDirectory(filePath)) {
        filePath = denoPath.join(filePath, "index.html");
        filePathInfo = denoPath.parse(filePath);
      }

      if (existsSync(filePath)) {
        res
          .status(200)
          .header(
            "content-type",
            MIME[filePathInfo.ext] || "application/octet-stream",
          )
          .set(Deno.readFileSync(filePath));
      }
    }
  }
}
