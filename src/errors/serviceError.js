export class ServiceError extends Error {

  constructor(type, data = {}) {
    super(type);
    this.data = data;
    this.serviceError = true;
  }
}
