import type { Prettify } from '~/common';

// Map template type strings to actual TypeScript types
interface ParamTypeMap {
  string: string;
  number: number;
  boolean: boolean;
}

export type ParamValue<Map extends Partial<ParamTypeMap> = ParamTypeMap> = Map[keyof Map];

/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars */

// Parse one parameter segment and extract its type mapping
type ExtractSegmentParams<
  Segment extends string,
  Types extends Partial<ParamTypeMap> = ParamTypeMap,
> = Segment extends `:{${infer Type}}:${infer Name}:${infer Optional}`
  ? Optional extends '?'
    ? { [K in Name]?: Type extends keyof Types ? Types[Type] : ParamValue<Types> }
    : { [K in Name]: Type extends keyof Types ? Types[Type] : ParamValue<Types> }
  : Segment extends `:{${infer Type}}:${infer Name}`
    ? { [K in Name]: Type extends keyof Types ? Types[Type] : ParamValue<Types> }
    : Segment extends `:${infer Name}:?`
      ? { [K in Name]?: ParamValue<Types> }
      : Segment extends `:${infer Name}`
        ? { [K in Name]: ParamValue<Types> }
        : {};

// Recursively parse the full path template
type ExtractRecursiveParams<
  Path extends string,
  Types extends Partial<ParamTypeMap> = ParamTypeMap,
  Result extends object = {},
> = Path extends `${infer Head}/${infer Tail}`
  ? ExtractRecursiveParams<Tail, Types, Result & ExtractSegmentParams<Head>>
  : Result & ExtractSegmentParams<Path, Types>;

/**
 * Extracts the parameters from a path template.
 * If the template does not contain any parameters, Record<string, ParamValue<Types> | undefined>
 */
export type ExtractPathParams<Path extends string, Types extends Partial<ParamTypeMap> = ParamTypeMap> = Prettify<
  Path extends `${infer _Start}/:${infer _End}` ? ExtractRecursiveParams<Path, Types> : Record<string, ParamValue<Types> | undefined>
>;

/**
 * Extracts the parameters from a strict path template.
 * If the template does not contain any parameters, Record<string, never> is returned.
 */
export type ExtractStrictPathParams<Path extends string, Types extends Partial<ParamTypeMap> = ParamTypeMap> = Prettify<
  Path extends `${infer _Start}/:${infer _End}` ? ExtractRecursiveParams<Path, Types> : Record<string, never>
>;

/* eslint-enable @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars */
