import { Middleware, Next } from "../middleware.ts";
import { Request } from "../request.ts";
import { Response } from "../response.ts";

export const Logger: Middleware = async (req: Request, res: Response, n: Next) => {
  console.log(`[${req.method}] ${req.url.href}`);
  await n();
}
