import { Request, Response } from "../../../mod.ts";

export class HomeController {
  index(req: Request, res: Response) {
    res.set("Hello World!");
  }
}
