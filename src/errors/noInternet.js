export class NoInternetError extends Error {
  constructor() {
    super('no-internet');
    this.ignoreLog = true;
  }
}