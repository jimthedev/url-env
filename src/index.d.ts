declare module 'url-env' {
  type EnvObject<T> = {
    pair: string[];
    url: string;
    env: T;
  }

  export function fromArray<T>(environmentsAsArrayOfArrays: [string, T][], matchUrl?: string): EnvObject<T>;
  export function fromObject<T>(environments: { [key: string]: T }, matchUrl?: string): EnvObject<T>;
}
