import * as React from 'react'

const useEventListener = <K extends keyof HTMLElementEventMap>(
  element: HTMLElement | Document | Window | void,
  eventType: K,
  listener: (evt: HTMLElementEventMap[K]) => void
) => {
  React.useEffect(() => {
    if (!element) return undefined

    element.addEventListener(eventType, listener)

    return () => {
      element.removeEventListener(eventType, listener)
    }
  }, [element, eventType, listener])
}

export default useEventListener
