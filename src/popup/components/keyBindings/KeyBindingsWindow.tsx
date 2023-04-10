import * as React from 'react'

import { useKeyBindingsContext } from './KeyBindingsContext.js'
import classes from './KeyBindingsWindow.module.css'

type Props = React.PropsWithChildren<{
  readonly windowId: string
}>
export default function KeyBindingsWindow({ children, windowId }: Props) {
  const { appendActiveWindowId, removeActiveWindowId } = useKeyBindingsContext()

  React.useEffect(() => {
    appendActiveWindowId(windowId)

    return () => {
      removeActiveWindowId(windowId)
    }
  }, [appendActiveWindowId, removeActiveWindowId, windowId])

  const windowRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    windowRef.current?.focus()
  }, [])

  return (
    <div
      ref={windowRef}
      className={classes['wrapper']}
      tabIndex={-1}
      onFocus={React.useCallback<React.FocusEventHandler>(
        (evt) => {
          evt.stopPropagation()

          appendActiveWindowId(windowId)
        },
        [appendActiveWindowId, windowId],
      )}
    >
      {children}
    </div>
  )
}
