type callback = (data?: any) => void;
const eventsStore: Record<string, callback[]> = {};

export function emit(eventName: string, data?: unknown) {
  (eventsStore[eventName] || []).forEach(callback => callback(data));
}

export function subscribe(event: string, callback: callback) {
  const callbacks = eventsStore[event] || [];
  eventsStore[event] = [...callbacks, callback];
  return () => {
    eventsStore[event] = callbacks.filter(cb => cb !== callback);
  };
}
