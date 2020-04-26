import { Middleware, Next } from "../middleware.ts";
import { Request } from "../request.ts";
import { Response } from "../response.ts";

import { ruteLog, ruteLogConnection } from "../utils/console.ts";

export const Logger: Middleware = async (req: Request, res: Response, n: Next) => {
  try {
    ruteLogConnection(req);
    await n();
  } catch (err) {
    ruteLog("Caught an", err);
  }
}
