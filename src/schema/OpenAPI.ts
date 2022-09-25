interface Server {
  url: string;
  description: string;
}

export interface OpenAPISchema {
  termsOfService?: string;
  contact?: {
    name: string;
    url: string;
    email: string;
  };
  license?: {
    name: string;
    url: string;
  };
  servers?: Server[];
}
