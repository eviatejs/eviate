export class EventEmitter {
  public events: Map<string, Set<Function>>;

  constructor() {
    this.events = new Map();
  }

  public on(event: string, listener: Function) {
    if (!this.events.has(event)) this.events.set(event, new Set());

    this.events.get(event)?.add(listener);
  }

  public off(event: string, listener: Function) {
    if (!this.events.has(event)) return;

    this.events.get(event)?.delete(listener);
  }

  public emit(event: string, ...args: any[]) {
    if (!this.events.has(event)) return;

    this.events.get(event)?.forEach(listener => listener(...args));
  }

  public once(event: string, listener: Function) {
    const wrapper = (...args: any[]) => {
      listener(...args);
      this.off(event, wrapper);
    };

    this.on(event, wrapper);
  }
}
