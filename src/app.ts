import { AppState } from './core/state';
import { EventHandler } from './core/event-handler';
import { AppParamsSchema } from './schema/AppParams';

import type { AppParamsInput } from './schema/AppParams';

export class Blurr {
  private appState: AppState;
  private eventHandler: EventHandler = new EventHandler();

  constructor(params: AppParamsInput) {
    const parsedParams = AppParamsSchema.safeParse(params);

    if (!parsedParams.success) {
      this.appState = new AppState({});
    } else {
      const { state } = parsedParams.data;

      this.appState = new AppState(state);
    }
  }
}
