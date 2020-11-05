import { Route } from "../route.ts";
import { HTTP, Request } from "../request.ts";
import { Response } from "../response.ts";

export const defaultPage = new Route("default", HTTP.ALL, (req: Request, res: Response) => {
  res.status(404).set(`Cannot ${req.method} ${req.url.pathname}`);
});