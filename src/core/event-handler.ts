import { EventHandlerType } from '../enums/EventHandlerType';

type HandlerFunc = (...args: any[]) => void;
type ServerControlHandler = () => void;

export class EventHandler {
  protected startupHandler?: ServerControlHandler;
  protected shutdownHandler?: ServerControlHandler;

  public setHandler(handlerType: EventHandlerType, handler: HandlerFunc): void {
    switch (handlerType) {
      case EventHandlerType.startup:
        this.startupHandler = handler;
        break;
      case EventHandlerType.shutdown:
        this.shutdownHandler = handler;
        break;
    }
  }
}
