export interface Response {
  status?: Number;
  text?: string;
  json?: {};
  error?: Error | string | {};
  headers?: {};
  interface?: any;
  Blob?: Blob;
}
