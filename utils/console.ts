import { Request } from "../request.ts";
import { Response } from "../response.ts";
import "https://raw.githubusercontent.com/jabernardo/strcolors.ts/0.1/mod.ts";

export function log(message: string, ...args: any[]) {
  console.log(`[${Date.now().toString().yellow()}]`, message.white(), ...args);
}
