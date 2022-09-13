class BlurrError extends Error {
  public route: string;
  public method: string;
  public originalError: Error;

  constructor(
    message: string,
    route: string,
    method: string,
    originalError: Error
  ) {
    super(message);

    this.name = 'BlurrError';

    this.route = route;
    this.method = method;
    this.originalError = originalError;
  }
}
