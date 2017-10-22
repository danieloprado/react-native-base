export class ApiError extends Error {
  constructor(request, response, err) {
    super('api-error');

    this.ignoreLog = true;
    this.request = request;
    this.response = response;
    this.originalError = err;
  }
}