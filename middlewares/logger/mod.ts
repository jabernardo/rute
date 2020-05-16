import "https://raw.githubusercontent.com/jabernardo/strcolors.ts/0.1/mod.ts";

import { Middleware, Next } from "../../middleware.ts";
import { Request } from "../../request.ts";
import { Response } from "../../response.ts";

import { log } from "../../utils/console.ts";

/**
 * Default Log Format
 *
 * @type {string}
 *
 */
export const DEFAULT_LOG_FORMAT: string =
  "@ :host::host_port/:host_transport ( from :remote_host::remote_port/:remote_transport - :request_method - :response_code - :request_url )";

/**
 * Formatted Connection String
 *
 * @templates
 *  - :host             - Host name
 *  - :host_port        - Host port
 *  - :host_transport   - Host transport method
 *  - :remote_host      - Client host name
 *  - :remote_port      - Client host port
 *  - :remote_transport - Client transport method
 *  - :request_method   - Request method
 *  - :request_url      - Request url
 *  - :response_code    - Response status code
 *
 * @param   {string}    format    New Connection Format
 * @param   {Request}   req       Request object
 * @param   {Response}  res       Response object
 * @return  {string}
 *
 */
export function fmtConnection(
  format: string,
  req: Request,
  res: Response,
): string {
  const { remoteAddr, localAddr } = req.connection;

  const localPort = "port" in localAddr ? localAddr.port.toString() : "";
  const localTransport = "transport" in localAddr
    ? localAddr.transport.toString()
    : "";
  const localHostName = "hostname" in localAddr ? localAddr.hostname : "";

  const remoteHostName = "hostname" in remoteAddr
    ? remoteAddr.hostname.toString()
    : "";
  const remotePort = "port" in remoteAddr ? remoteAddr.port.toString() : "";
  const remoteTransport = "transport" in remoteAddr
    ? remoteAddr.transport.toString()
    : "";

  const responseCode = res.code < 500
    ? res.code.toString().green()
    : res.code.toString().red();

  const requestMethod = req.method;
  const requestUrl = req.url.href;

  return format
    .replace(/:host_port/ig, localPort.green())
    .replace(/:host_transport/ig, localTransport.green())
    .replace(/:host/ig, localHostName.blue())
    .replace(/:remote_host/ig, remoteHostName.blue())
    .replace(/:remote_port/ig, remotePort.green())
    .replace(/:remote_transport/ig, remoteTransport.green())
    .replace(/:request_method/ig, requestMethod.cyan())
    .replace(/:request_url/ig, requestUrl.magenta())
    .replace(/:response_code/ig, responseCode);
}

/**
 * Get logger middleware
 *
 * @link    fmtConnection
 * @param   {string}  format  Connection string format
 * @return  {Middleware}
 *
 */
export function Logger(format?: string): Middleware {
  return async (req: Request, res: Response, n: Next) => {
    await n();
    log(fmtConnection(format || DEFAULT_LOG_FORMAT, req, res));
  };
}
