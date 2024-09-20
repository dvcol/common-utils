export const enum ErrorTypes {
  /**
   * Parsing errors are thrown when the router cannot compute a relative path.
   */
  PARSING_RELATIVE_PATH_ERROR = 'PARSING_RELATIVE_PATH_ERROR',
}

type ParsingErrorTypes = ErrorTypes.PARSING_RELATIVE_PATH_ERROR;
export class ParsingError<E = unknown> extends Error {
  readonly type: ParsingErrorTypes;
  readonly error?: E;
  constructor(type: ParsingErrorTypes, error: E, message = `Parsing error: ${type}`) {
    super(message);
    this.type = type;
    this.error = error;
  }
}

type ParsingRelativePathErrorPayload = { parent?: string; relative?: string };
export class ParsingRelativePathError extends ParsingError<ParsingRelativePathErrorPayload> {
  declare readonly type: ErrorTypes.PARSING_RELATIVE_PATH_ERROR;
  constructor(
    { parent, relative }: ParsingRelativePathErrorPayload,
    message = `Error parsing relative path "${relative}" from parent path "${parent}"`,
  ) {
    super(ErrorTypes.PARSING_RELATIVE_PATH_ERROR, { parent, relative }, message);
  }
}
