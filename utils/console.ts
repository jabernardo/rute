import { Request } from "../request.ts";
import { Response } from "../response.ts";
import "https://raw.githubusercontent.com/jabernardo/strcolors.ts/0.1/mod.ts";

export function log(message: string, ...args: any[]) {
  console.log(`[${Date.now().toString().yellow()}]`, message.white(), ...args);
}

export function logConnection(req: Request, res: Response) {
  const { remoteAddr, localAddr} = req.connection;

  const localPort = "port"  in localAddr ? localAddr.port.toString() : "";
  const localTransport = "transport" in localAddr ? localAddr.transport.toString() : "";
  const localHostName = "hostname" in localAddr ? localAddr.hostname : "";

  const remoteHostName = "hostname" in remoteAddr ? remoteAddr.hostname.toString() : "";
  const remotePort = "port"  in remoteAddr ? remoteAddr.port.toString() : "";
  const remoteTransport = "transport" in remoteAddr ? remoteAddr.transport.toString() : "";

  const responseCode = res.code < 500 ? res.code.toString().green() : res.code.toString().red();

  log(`@ ${localHostName.blue()}:${localPort.green()}/${localTransport.green()} ( from ${remoteHostName.blue()}:${remotePort.green()}/${remoteTransport.green()} - ${req.method.cyan()} - ${responseCode} - ${req.url.href.magenta()} )`);
}