import type { State } from '../interfaces/state';

export class AppState {
  private state: State;

  constructor(state: State) {
    this.state = { ...state };
  }

  public getKey<T>(key: string): T {
    return this.state[key];
  }

  public setKey<T>(key: string, value: T): void {
    this.state[key] = value;
  }
}
