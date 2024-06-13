interface NavigatorBrandVersion {
  readonly brand: string;
  readonly version: string;
}

interface NavigatorUserAgentData {
  readonly brands: NavigatorBrandVersion[];
  readonly mobile: boolean;
  readonly platform: string;
}

declare global {
  interface Navigator {
    userAgentData?: NavigatorUserAgentData;
  }
}

/**
 * Returns true if the navigator indicates macOS
 */
export const isMacOs = () => {
  const userAgent = navigator?.userAgent;
  if (userAgent.indexOf('Mac') !== -1) return true;
  const platform = navigator?.userAgentData?.platform ?? navigator?.platform;
  return platform.indexOf('mac') !== -1;
};

/**
 * Returns the short locale (ISO 639-1) of the current browser.
 * I.e. 'en' for 'en-US'.
 */
export const getShortLocale: () => string = () => navigator?.language?.split('-').at(0) ?? 'en';
