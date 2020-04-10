import { Middleware, Next } from "../middleware.ts";
import { Request } from "../request.ts";
import { Response } from "../response.ts";

export const Logger: Middleware = async (req: Request, res: Response, n: Next) => {
  const { remoteAddr, localAddr} = req.connection;

  const localPort = "port"  in localAddr ? localAddr.port : "";
  const localTransport = "transport" in localAddr ? localAddr.transport : "";
  const localHostName = "hostname" in localAddr ? localAddr.hostname : "";

  const remoteHostName = "hostname" in remoteAddr ? remoteAddr.hostname : "";
  const remotePort = "port"  in remoteAddr ? remoteAddr.port : "";
  const remoteTransport = "transport" in remoteAddr ? remoteAddr.transport : "";

  console.log(`@ ${localHostName}:${localPort}/${localTransport} ( from ${remoteHostName}:${remotePort}/${remoteTransport} - ${req.method} - ${req.url.href} )`);
  await n();
}
