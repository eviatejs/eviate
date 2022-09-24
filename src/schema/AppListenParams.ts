export interface AppListenParams {
  hostname: string;
  port: number;
  debug: boolean;
}

export const defaultAppListenParams: AppListenParams = {
  hostname: '127.0.0.1',
  port: 4000,
  debug: false
};
