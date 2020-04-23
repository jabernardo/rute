import { Request } from "../request.ts";

export function ruteLog(message: string, ...args: any[]) {
  console.log(`[${Date.now()}] ${message}`, ...args);
}

export function ruteLogConnection(req: Request) {
  const { remoteAddr, localAddr} = req.connection;

  const localPort = "port"  in localAddr ? localAddr.port : "";
  const localTransport = "transport" in localAddr ? localAddr.transport : "";
  const localHostName = "hostname" in localAddr ? localAddr.hostname : "";

  const remoteHostName = "hostname" in remoteAddr ? remoteAddr.hostname : "";
  const remotePort = "port"  in remoteAddr ? remoteAddr.port : "";
  const remoteTransport = "transport" in remoteAddr ? remoteAddr.transport : "";

  ruteLog(`@ ${localHostName}:${localPort}/${localTransport} ( from ${remoteHostName}:${remotePort}/${remoteTransport} - ${req.method} - ${req.url.href} )`);
}