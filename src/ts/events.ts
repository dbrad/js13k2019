type EventHandler = (...params: any[]) => void;

const events: Map<string, Map<string, EventHandler>> = new Map();

export function subscribe(eventName: string, observerName: string, handler: EventHandler): void {
  if (!events.has(eventName)) {
    events.set(eventName, new Map());
  }
  events.get(eventName).set(observerName, handler);
}

export function unsubscribe(eventName: string, observerName: string): void {
  events.get(eventName).delete(observerName);
}

export function unsubscribeAll(eventName: string): void {
  events.get(eventName).clear();
}

export function emit(eventName: string, ...params: any[]): void {
  const handlers: Map<string, EventHandler> = events.get(eventName);
  for (const [observerName, handler] of handlers) {
    setTimeout(handler, 0, ...params);
  }
}
