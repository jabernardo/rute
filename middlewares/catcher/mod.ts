import "https://raw.githubusercontent.com/jabernardo/strcolors.ts/0.1/mod.ts";

import { Middleware, Next } from "../../middleware.ts";
import { Request } from "../../request.ts";
import { Response } from "../../response.ts";
import { log } from "../../utils/console.ts";

import { fmtConnection, DEFAULT_LOG_FORMAT } from "../logger/mod.ts";

/**
 * Type for error catching
 *
 * @type    {CatcherCallback}
 * @param   {Error}     err Error Instance
 * @param   {Request}   req Request object
 * @param   {Response}  res Response object
 * @return  {any}
 *
 */
export type CatcherCallback = (err: Error, req: Request, res: Response) => any;

/**
 * Default Catcher Callback
 *
 * @param   {Error}     err Error Instance
 * @param   {Request}   req Request object
 * @param   {Response}  res Response object
 * @return  {void}
 *
 */
export const defaultCatcher = (
  err: Error,
  req: Request,
  res: Response,
): void => {
  log(fmtConnection(DEFAULT_LOG_FORMAT, req, res), err);
};

/**
 * Get Catcher Middleware
 *
 * @param   {CatcherCallback} action Custom Callback for Errors
 * @return  {Middleware}
 */
export function catcher(action?: CatcherCallback): Middleware {
  return async (req: Request, res: Response, n: Next) => {
    try {
      await n();
    } catch (err) {
      await (action ? action(err, req, res) : defaultCatcher(err, req, res));
    }
  };
}
