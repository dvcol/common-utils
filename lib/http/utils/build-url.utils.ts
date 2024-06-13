import type { BaseHttpRequest, HttpParameters } from '~/http/models';

/**
 * Helper function to build a URL from url and parameters
 * @param url base url
 * @param params optional parameters
 * @see URL
 */
export const buildUrl = (url: BaseHttpRequest['url'], params?: HttpParameters): URL => {
  const builder = new URL(typeof url === 'string' || url instanceof URL ? url : `${url.base}/${url.path}`);
  if (params) {
    Object.entries(params)
      .map(e => ({ key: e[0], value: e[1] }))
      .forEach(({ key, value }) =>
        Array.isArray(value) ? value.forEach(val => builder.searchParams.append(key, val)) : builder.searchParams.append(key, value),
      );
  }
  return builder;
};
