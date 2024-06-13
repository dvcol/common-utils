import type { HttpBody, HttpHeaders, HttpMethods, HttpParameters } from '~/http/models';

/** Base Http request interface */
export interface BaseHttpRequest extends RequestInit {
  url: string | URL | { path: string | URL; base: string | URL };
  params?: HttpParameters;
  method?: HttpMethods;
  headers?: HttpHeaders;
  body?: HttpBody;
  redirect?: RequestRedirect;
}
