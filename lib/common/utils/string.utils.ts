/**
 * Parse string to JSON
 * @param json
 * @see JSON.parse
 */
export const parseJSON = <T>(json?: string | object) => (typeof json == 'string' && json?.length ? JSON.parse(json) : json) as T;

/**
 * Create FormData from a record
 * @param params
 * @see FormData
 */
export const buildFormData = (params: Record<string, string | string[] | Blob>): FormData =>
  Object.keys(params).reduce((_form, key) => {
    let value = params[key];
    if (Array.isArray(value)) value = value?.join(',');
    _form.append(key, value);
    return _form;
  }, new FormData());

/**
 * Stringify record into url safe parameters
 * @param params
 */
export const stringifyParams = (params: { [key: string]: string | string[] }): string =>
  Object.entries(params)
    .map(([k, v]) => `${k}=${Array.isArray(v) ? v?.map(encodeURIComponent).join(',') : encodeURIComponent(v)}`)
    .join('&');

/**
 * Stringify keys of a record
 * @param record
 * @param stringify uses JSON.stringify instead of calling toString if true
 */
export const stringifyKeys = <T extends Record<string, any>>(record: T, stringify = false): Record<string, string> =>
  Object.entries(record).reduce((acc, [key, value]) => {
    if (value === undefined) return acc;
    if (value === null) return acc;
    acc[key] = stringify ? JSON.stringify(value) : value?.toString();
    return acc;
  }, {} as any);

const versionCompare = (version: number[], current: number[]) => {
  for (let i = 0; i < version?.length; i += 1) {
    if (version[i] && !current[i]) return 1;
    if (version[i] < current[i]) return -1;
    if (version[i] > current[i]) return 1;
  }
  return version?.length >= current?.length ? 0 : -1;
};

/**
 * Returns 1 if version is higher than compared, -1 if it's lower and 0 if it's equal
 * @param version
 * @param compared
 */
export const versionCheck = (version: string, compared: string) => {
  const _compared = compared?.split('.')?.map(Number);
  const _version = version?.split('.')?.map(Number);
  return versionCompare(_version, _compared);
};

const regex = /(^\w|[.:]\s\w)/g;

export const sentenceCase = (input?: string) =>
  input?.toLowerCase().replace(regex, letter => {
    return letter.toUpperCase();
  });

export const capitalizeEachWord = (input: string) => input?.toLowerCase().replace(/\b\w/g, match => match.toUpperCase());

export const deCapitalise = (input?: string) => {
  if (!input?.trim()) return input;
  if (input !== input.toUpperCase()) return input;
  return capitalizeEachWord(input);
};

export const getUUID = () => crypto.getRandomValues(new Uint32Array(4)).join('-');
