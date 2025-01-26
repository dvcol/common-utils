import { toKebabCase } from '~/common';

type Value = string | undefined | null;
export type Values = Value | Value[] | Record<string, boolean | string> | CSSStyleDeclaration;

const flatten = (styles?: Values, flat: string[] = [], camel?: boolean): string[] => {
  if (!styles) return flat;
  if (typeof styles === 'string') flat.push(styles);
  else if (Array.isArray(styles)) {
    styles.forEach(style => {
      if (!style) return;
      flatten(style, flat, camel);
    });
  } else if (typeof styles === 'object') {
    Object.entries(styles).forEach(([key, value]) => {
      if (!value) return;
      if (typeof value === 'string') {
        if (camel) flat.push(`${toKebabCase(key)}:${value}`);
        else flat.push(`${key}:${value}`);
      } else flat.push(key);
    });
  }
  return flat;
};

const parse = (args: Values[], separator = '', camel?: boolean): string => {
  if (!args.length) return;
  const flat: string[] = [];
  args.forEach(arg => flatten(arg, flat, camel));
  return flat
    .filter(Boolean)
    .map(style => {
      if (!separator) return style.trim();
      const _style = style.trim();
      return _style.endsWith(separator) ? _style.slice(0, -1) : _style;
    })
    .join(`${separator} `);
};

export const toClass = (...args: Values[]) => parse(args);
export const toStyle = (...args: Values[]) => parse(args, ';', true);
