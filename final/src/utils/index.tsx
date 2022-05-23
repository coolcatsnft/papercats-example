/**
 * Get an env variable or return a default
 *
 * @param name         Name of env
 * @param defaultValue Default value
 *
 * @returns mixed
 */
export function envDefault(name: string, defaultValue: any): any {
  try {
    return env(name);
  } catch(e: any) {
    return defaultValue;
  }
}

/**
 * Get an env variable
 *
 * @param name Name of env variable
 *
 * @returns string
 *
 * @throws Error
 */
 export function env(name: string): any {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing: process.env['${name}'].`);
  }

  return value;
}