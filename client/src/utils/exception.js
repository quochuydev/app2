const TYPES = {
  NONE: 0,
  NOT_IMPLEMENT: 1,
  API: 2,
  INVALID_ARGUMENT: 3
};

class Exception {
  static TYPES = TYPES;

  constructor(type = TYPES.NONE, message = '', isError = false, statusCode = 0, description = '') {
    this.type = type;
    this.message = message;
    this.isError = isError;
    this.statusCode = statusCode;
    this.description = description;
  }
}

export default Exception;
