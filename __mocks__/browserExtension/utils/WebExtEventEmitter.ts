export class WebExtEventEmitter<
  EventArgs extends readonly unknown[],
  WebExtEventEventListener extends (...args: EventArgs) => void = (
    ...args: EventArgs
  ) => void,
> {
  readonly #eventTarget = new EventTarget()
  readonly #eventType = 'message'
  readonly #listenerMap = new WeakMap<WebExtEventEventListener, EventListener>()

  public addListener(callback: WebExtEventEventListener): void {
    const listener: EventListener = (evt) => {
      callback(...(evt as CustomEvent<EventArgs>).detail)
    }

    this.#listenerMap.set(callback, listener)
    this.#eventTarget.addEventListener(this.#eventType, listener)
  }

  public hasListener(callback: WebExtEventEventListener): boolean {
    return this.#listenerMap.has(callback)
  }

  public removeListener(callback: WebExtEventEventListener): void {
    const listener = this.#listenerMap.get(callback)
    if (!listener) return

    this.#listenerMap.delete(callback)
    this.#eventTarget.removeEventListener(this.#eventType, listener)
  }

  public dispatchEvent(eventData: EventArgs) {
    this.#eventTarget.dispatchEvent(
      new CustomEvent(this.#eventType, { detail: eventData }),
    )
  }
}
