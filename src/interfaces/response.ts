export interface response {
  status?: Number;
  text?: string;
  json?: {};
  error?: Error | string | {};
  headers?: {};
  interface: any;
  Blob?: Blob;
}
