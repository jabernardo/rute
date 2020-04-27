import { Request } from "../request.ts";

export function log(message: string, ...args: any[]) {
  console.log(`[${Date.now()}] ${message}`, ...args);
}

export function logConnection(req: Request) {
  const { remoteAddr, localAddr} = req.connection;

  const localPort = "port"  in localAddr ? localAddr.port : "";
  const localTransport = "transport" in localAddr ? localAddr.transport : "";
  const localHostName = "hostname" in localAddr ? localAddr.hostname : "";

  const remoteHostName = "hostname" in remoteAddr ? remoteAddr.hostname : "";
  const remotePort = "port"  in remoteAddr ? remoteAddr.port : "";
  const remoteTransport = "transport" in remoteAddr ? remoteAddr.transport : "";

  log(`@ ${localHostName}:${localPort}/${localTransport} ( from ${remoteHostName}:${remotePort}/${remoteTransport} - ${req.method} - ${req.url.href} )`);
}