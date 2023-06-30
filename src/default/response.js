class DefaultResponse {
  static generateSuccessResponse(code, msg = "", data) {
    const res = {
      status: code,
      message: msg,
      data,
    };
    return res;
  }
  static generateErrorResponse(code, errors) {
    const res = {
      status: code,
      errors,
    };
    return res;
  }
}

module.exports = DefaultResponse;
