import type { Prettify } from '~/common';

export type ParamValue = string | number | boolean;

// Map template type strings to actual TypeScript types
interface ParamTypeMap {
  string: string;
  number: number;
  boolean: boolean;
}

/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars */

// Parse one parameter segment and extract its type mapping
type ExtractSegmentParams<Segment extends string> = Segment extends `:{${infer Type}}:${infer Name}:${infer Optional}`
  ? Optional extends '?'
    ? { [K in Name]?: Type extends keyof ParamTypeMap ? ParamTypeMap[Type] : ParamValue }
    : { [K in Name]: Type extends keyof ParamTypeMap ? ParamTypeMap[Type] : ParamValue }
  : Segment extends `:{${infer Type}}:${infer Name}`
    ? { [K in Name]: Type extends keyof ParamTypeMap ? ParamTypeMap[Type] : ParamValue }
    : Segment extends `:${infer Name}:?`
      ? { [K in Name]?: ParamValue }
      : Segment extends `:${infer Name}`
        ? { [K in Name]: ParamValue }
        : {};

// Recursively parse the full path template
type ExtractRecursiveParams<Path extends string, Result extends object = {}> = Path extends `${infer Head}/${infer Tail}`
  ? ExtractRecursiveParams<Tail, Result & ExtractSegmentParams<Head>>
  : Result & ExtractSegmentParams<Path>;

// Exclude non-parameter segments
export type ExtractPathParams<Path extends string> = Prettify<
  Path extends `${infer _Start}/:${infer _End}` ? ExtractRecursiveParams<Path> : Record<string, never>
>;

/* eslint-enable @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars */
