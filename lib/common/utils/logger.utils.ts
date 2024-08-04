export enum LogLevel {
  Error,
  Warn,
  Info,
  Debug,
}

export const TimeStampFormat = {
  ISO: 'ISO',
  Date: 'Date',
  Time: 'Time',
  Local: 'Local',
} as const;

export type TimeStampFormats = keyof typeof TimeStampFormat;

/**
 * Generate a logging timestamp
 * @param scope the logging scope, default to globalThis._proxyLoggerScope
 * @param format the timestamp format, default to 'TIME'
 */
export const getTimestamp = (scope?: string, format: TimeStampFormats = TimeStampFormat.Time) => {
  let date: string;
  if (format === TimeStampFormat.ISO) date = new Date().toISOString();
  else if (format === TimeStampFormat.Date) date = new Date().toLocaleDateString().split('T').at(0);
  else if (format === TimeStampFormat.Local) date = new Date().toLocaleString();
  else date = new Date().toLocaleTimeString('en', { hour12: false, timeZone: 'UTC' });
  return scope ? `[${date} - ${scope}]` : `[${date}]`;
};

/**
 * Logger color constants
 */
export const LoggerColor = {
  Debug: '#9e9e9e',
  Info: '#5bd4f9',
  Warn: '#f2c61a',
  Error: '#ff5549',
  Success: '#00ff00',
} as const;

/**
 * Console format specifiers
 * @see {@link [Console format specifiers](https://developer.chrome.com/docs/devtools/console/format-style/) }
 */
export const ConsoleFormat = {
  /**
   * Formats the value as a string
   * @see ConsoleFormat
   */
  String: '%s',
  /**
   * Formats the value as an integer
   * @see ConsoleFormat
   */
  Integer: '%i',
  /**
   * Formats the value as a floating point value
   * @see ConsoleFormat
   */
  Float: '%f',
  /**
   * Formats the value as an expandable DOM element
   * @see ConsoleFormat
   */
  DOM: '%o',
  /**
   * Formats the value as an expandable JavaScript object
   * @see ConsoleFormat
   */
  Object: '%O',
  /**
   * Applies CSS style rules to the output string as specified by the second parameter
   * @see ConsoleFormat
   */
  Style: '%c',
};

export const colorize = <T extends unknown[]>(color: string, ...args: T): Parameters<typeof console.log> => {
  if (!args?.some(arg => typeof arg === 'string')) return args;
  let prefix = '%c';
  const _args: T = [`color: ${color}`] as T;
  args.forEach((arg, i) => {
    const space = i ? ' ' : '';
    if (arg instanceof Element) {
      if (i < args.length - 1) prefix += `${space}${ConsoleFormat.DOM}`;
    } else if (typeof arg === 'object') {
      if (i < args.length - 1) prefix += `${space}${ConsoleFormat.Object}`;
    } else if (typeof arg === 'string') {
      prefix += `${space}${ConsoleFormat.String}`;
    } else if (typeof arg === 'number') {
      prefix += `${space}${ConsoleFormat.Float}`;
    }
    _args.push(arg);
  });
  _args.unshift(prefix);
  return _args;
};

export type ProxyLoggerFilter = Partial<Record<keyof Console, (logLevel: LogLevel, ...args: unknown[]) => boolean>>;

export const proxyLoggerFilter: ProxyLoggerFilter = {
  trace: (logLevel: LogLevel) => logLevel >= LogLevel.Debug,
  debug: (logLevel: LogLevel) => logLevel >= LogLevel.Debug,
  info: (logLevel: LogLevel) => logLevel >= LogLevel.Info,
  warn: (logLevel: LogLevel) => logLevel >= LogLevel.Warn,
  error: (logLevel: LogLevel) => logLevel >= LogLevel.Error,
} as const;

type ProxyLoggerInit = {
  proxy?: ProxyLoggerFilter;
  logger?: Console;
  debug?: boolean | (() => boolean);
  logLevel?: number | (() => number);
  timeFormat?: TimeStampFormats | (() => TimeStampFormats);
};
/**
 * Proxy logger to control this extension log level
 */
export class ProxyLogger {
  private readonly _logger: Console;
  private readonly _proxy?: ProxyLoggerFilter;

  private readonly _timeFormat: ProxyLoggerInit['timeFormat'];
  private readonly _debug: ProxyLoggerInit['debug'];
  private _logLevel: ProxyLoggerInit['logLevel'];

  constructor({
    logger = console,
    debug = false,
    proxy = proxyLoggerFilter,
    logLevel = LogLevel.Warn,
    timeFormat = TimeStampFormat.Time,
  }: ProxyLoggerInit = {}) {
    this._logger = logger;
    this._proxy = proxy;
    this._debug = debug;
    this._logLevel = logLevel;
    this._timeFormat = timeFormat;
  }

  get timeFormat() {
    return typeof this._timeFormat === 'function' ? this._timeFormat() : this._timeFormat;
  }

  get isDebug() {
    return typeof this._debug === 'function' ? this._debug() : this._debug;
  }

  get logLevel() {
    return typeof this._logLevel === 'function' ? this._logLevel() : this._logLevel;
  }

  set logLevel(level: LogLevel) {
    if (this._debug) console.debug('[ProxyLogger] - Log level changed:', LogLevel[level]);
    if (typeof this._logLevel === 'function') throw new Error('Cannot set log level when logLevel is a function');
    this._logLevel = level;
  }

  private null = (...args: unknown[]) => {
    if (this.isDebug) console.debug('[ProxyLogger] - Log suppressed:', ...args);
  };

  get trace() {
    if (!this._proxy?.trace?.(this.logLevel)) return this.null;
    return this._logger.trace.bind(this._logger);
  }

  get debug() {
    if (!this._proxy?.debug?.(this.logLevel)) return this.null;
    return this._logger.debug.bind(this._logger);
  }

  get info() {
    if (!this._proxy?.info?.(this.logLevel)) return this.null;
    return this._logger.info.bind(this._logger);
  }

  get warn() {
    if (!this._proxy?.warn?.(this.logLevel)) return this.null;
    return this._logger.warn.bind(this._logger);
  }

  get error() {
    if (!this._proxy?.error?.(this.logLevel)) return this.null;
    return this._logger.error.bind(this._logger);
  }

  static logger = new ProxyLogger();
  static timestamp = getTimestamp;
  static colorize = colorize;

  color = {
    debug: (...args: Parameters<typeof console.debug>) => this.debug(...ProxyLogger.colorize(LoggerColor.Debug, ...args)),
    info: (...args: Parameters<typeof console.info>) => this.info(...ProxyLogger.colorize(LoggerColor.Info, ...args)),
    warn: (...args: Parameters<typeof console.warn>) => this.warn(...ProxyLogger.colorize(LoggerColor.Warn, ...args)),
    error: (...args: Parameters<typeof console.error>) => this.error(...ProxyLogger.colorize(LoggerColor.Error, ...args)),
    success: (...args: Parameters<typeof console.info>) => this.info(...ProxyLogger.colorize(LoggerColor.Success, ...args)),
  };

  /**
   * Logger with timestamp but looses stack trace origin
   */
  time = {
    debug: (...args: Parameters<typeof console.debug>) => this.debug(ProxyLogger.timestamp(undefined, this.timeFormat), ...args),
    info: (...args: Parameters<typeof console.info>) => this.info(ProxyLogger.timestamp(undefined, this.timeFormat), ...args),
    warn: (...args: Parameters<typeof console.warn>) => this.warn(ProxyLogger.timestamp(undefined, this.timeFormat), ...args),
    error: (...args: Parameters<typeof console.error>) => this.error(ProxyLogger.timestamp(undefined, this.timeFormat), ...args),
    color: {
      debug: (...args: Parameters<typeof console.debug>) => this.color.debug(ProxyLogger.timestamp(undefined, this.timeFormat), ...args),
      info: (...args: Parameters<typeof console.info>) => this.color.info(ProxyLogger.timestamp(undefined, this.timeFormat), ...args),
      warn: (...args: Parameters<typeof console.warn>) => this.color.warn(ProxyLogger.timestamp(undefined, this.timeFormat), ...args),
      error: (...args: Parameters<typeof console.error>) => this.color.error(ProxyLogger.timestamp(undefined, this.timeFormat), ...args),
      success: (...args: Parameters<typeof console.info>) => this.color.success(ProxyLogger.timestamp(undefined, this.timeFormat), ...args),
    },
  };

  scope = (_scope: string) => ({
    debug: (...args: Parameters<typeof console.debug>) => this.debug(ProxyLogger.timestamp(_scope, this.timeFormat), ...args),
    info: (...args: Parameters<typeof console.info>) => this.info(ProxyLogger.timestamp(_scope, this.timeFormat), ...args),
    warn: (...args: Parameters<typeof console.warn>) => this.warn(ProxyLogger.timestamp(_scope, this.timeFormat), ...args),
    error: (...args: Parameters<typeof console.error>) => this.error(ProxyLogger.timestamp(_scope, this.timeFormat), ...args),
    color: {
      debug: (...args: Parameters<typeof console.debug>) => this.color.debug(ProxyLogger.timestamp(_scope, this.timeFormat), ...args),
      info: (...args: Parameters<typeof console.info>) => this.color.info(ProxyLogger.timestamp(_scope, this.timeFormat), ...args),
      warn: (...args: Parameters<typeof console.warn>) => this.color.warn(ProxyLogger.timestamp(_scope, this.timeFormat), ...args),
      error: (...args: Parameters<typeof console.error>) => this.color.error(ProxyLogger.timestamp(_scope, this.timeFormat), ...args),
      success: (...args: Parameters<typeof console.info>) => this.color.success(ProxyLogger.timestamp(_scope, this.timeFormat), ...args),
    },
  });

  colored = {};
}
