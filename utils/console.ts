// Import: Global from strcolors.ts (github.com/jabernardo/strcolors.ts)
import "../deps.ts";

/**
 * Log message with time stamp
 *
 * @param   {string}  message   Message
 * @param   {any}     args      Optional args
 * @return  {void}  Void
 */
export function log(message: string, ...args: any[]) {
  console.log(`[${Date.now().toString().yellow()}]`, message.white(), ...args);
}
