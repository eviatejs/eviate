import type { OpenAPISchema } from './OpenAPI';
import type { Engine } from '../core';

export interface AppMetadata {
  title: string;
  description: string;
  version: string;
}

export const defaultAppMetadataParams = {
  title: 'Eviate',
  description: '',
  version: '1.0.0'
};

export interface AppParams {
  metadata: AppMetadata;
  state: Record<string, any>;
  openapi?: (app: Engine) => OpenAPISchema;
}

export const defaultAppStateParams = {};
