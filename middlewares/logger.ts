import "https://raw.githubusercontent.com/jabernardo/strcolors.ts/0.1/mod.ts";

import { Middleware, Next } from "../middleware.ts";
import { Request } from "../request.ts";
import { Response } from "../response.ts";

import { log, logConnection } from "../utils/console.ts";

export const Logger: Middleware = async (req: Request, res: Response, n: Next) => {
  try {
    await n();
    logConnection(req, res);
  } catch (err) {
    logConnection(req, res.status(500));
    log("Caught an".bgRed().white(), err);
  }
}
