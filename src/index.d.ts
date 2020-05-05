declare module 'url-env' {
  type EnvObject = {
    pair: string[];
    url: string;
    env: string;
  }

  export function fromArray<T>(environmentsAsArrayOfArrays: T[][], matchUrl?: string): EnvObject;
  export function fromObject(environments: { [key: string]: string }, matchUrl?: string): EnvObject;
}
