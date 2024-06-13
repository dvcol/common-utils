import { describe, it, expect, vi, afterEach } from 'vitest';

import { LogLevel, ProxyLogger } from './logger.utils';

describe('logger.utils.ts', () => {
  const message = 'This is a message';

  afterEach(() => {
    ProxyLogger.logger.logLevel = LogLevel.Error;
    vi.clearAllMocks();
  });

  it('should log a message', () => {
    expect.assertions(1);

    const spyConsoleWarn = vi.spyOn(console, 'warn');

    ProxyLogger.logger.warn(message);

    expect(spyConsoleWarn).toHaveBeenCalledWith(message);
  });

  it('should not log a message', () => {
    expect.assertions(1);

    const spyConsoleWarn = vi.spyOn(console, 'warn');

    ProxyLogger.logger.logLevel = LogLevel.Error;
    ProxyLogger.logger.warn(message);

    expect(spyConsoleWarn).not.toHaveBeenCalled();
  });

  it('should not log a message with an new instance', () => {
    expect.assertions(1);

    const spyConsoleWarn = vi.spyOn(console, 'warn');

    const logger = new ProxyLogger({ logLevel: LogLevel.Error });
    logger.warn(message);

    expect(spyConsoleWarn).not.toHaveBeenCalled();
  });
});
