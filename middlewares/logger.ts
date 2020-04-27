import { Middleware, Next } from "../middleware.ts";
import { Request } from "../request.ts";
import { Response } from "../response.ts";

import { log, logConnection } from "../utils/console.ts";

export const Logger: Middleware = async (req: Request, res: Response, n: Next) => {
  try {
    logConnection(req);
    await n();
  } catch (err) {
    log("Caught an", err);
  }
}
