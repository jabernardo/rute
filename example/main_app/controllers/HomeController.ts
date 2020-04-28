import { Request, Response } from "../../../mod.ts";

export class HomeController {
  message: string = "Hello World!";

  index(req: Request, res: Response) {
    res.set(this.message);
  }
}
