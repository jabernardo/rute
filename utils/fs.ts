const { lstatSync } = Deno;

/**
 * Check if path is a directory
 *
 * @param   {string}  path System path
 * @return  {boolean} is directory?
 */
export function isDirectory(path: string): boolean {
  try {
    const fileInfo = lstatSync(path);
    return fileInfo.isDirectory;
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
  }

  return false;
}
