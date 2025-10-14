/**
 * Result object containing environment configuration and matching URL information
 */
export interface EnvObject<T = string> {
  /** The original URL-environment pair that matched */
  pair: [string, T];
  /** The URL pattern that was matched */
  url: string;
  /** The environment configuration object */
  env: T;
}

/**
 * Finds the environment configuration that matches the given URL from an array of
 * URL-environment pairs. Matches based on URL prefix (using startsWith).
 *
 * @param environments - Array of [URL, environment] tuples where URL is the prefix to match
 * @param matchUrl - The URL to match against (defaults to current window location)
 * @returns Environment result containing the matched configuration
 * @throws Error if no matching environment is found
 *
 * @example
 * ```typescript
 * const envs = [
 *   ["https://prod.example.com", { api: "https://api.prod.com" }],
 *   ["https://dev.example.com", { api: "https://api.dev.com" }]
 * ];
 * const result = fromArray(envs, "https://prod.example.com/page");
 * console.log(result.env.api); // "https://api.prod.com"
 * ```
 */
export function fromArray<T>(
  environments: Array<[string, T]>,
  matchUrl: string = typeof window !== 'undefined' ? window.location.href : ''
): EnvObject<T> {
  const pair = environments.find(
    (environment) => matchUrl.startsWith(environment[0])
  );
  if (!pair) {
    throw new Error('No matching environment found.');
  }
  return {
    pair,
    url: pair[0],
    env: pair[1],
  };
}

/**
 * Finds the environment configuration that matches the given URL from an object of
 * URL-environment pairs. This is a convenience wrapper around fromArray.
 *
 * @param environments - Record where keys are URL prefixes and values are configs
 * @param matchUrl - The URL to match against (defaults to current window location)
 * @returns Environment result containing the matched configuration
 * @throws Error if no matching environment is found
 *
 * @example
 * ```typescript
 * const envs = {
 *   "https://prod.example.com": { api: "https://api.prod.com" },
 *   "https://dev.example.com": { api: "https://api.dev.com" }
 * };
 * const result = fromObject(envs, "https://prod.example.com/page");
 * console.log(result.env.api); // "https://api.prod.com"
 * ```
 */
export function fromObject<T>(
  environments: Record<string, T>, 
  matchUrl: string = typeof window !== 'undefined' ? window.location.href : ''
): EnvObject<T> {
  return fromArray(Object.entries(environments), matchUrl);
}
