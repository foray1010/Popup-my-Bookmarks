import classNames from 'classnames'
import * as React from 'react'

import { useKeyBindingsContext } from './KeyBindingsContext'
import classes from './KeyBindingsWindow.css'

type Props = React.HTMLAttributes<Element> & {
  windowId: string
}
const KeyBindingsWindow = ({
  children,
  className,
  onFocus,
  windowId,
  ...props
}: Props) => {
  const { setActiveWindowId, unsetActiveWindowId } = useKeyBindingsContext()

  React.useEffect(() => {
    setActiveWindowId(windowId)

    return () => {
      unsetActiveWindowId(windowId)
    }
  }, [setActiveWindowId, unsetActiveWindowId, windowId])

  const handleFocus = React.useCallback<React.FocusEventHandler>(
    (evt) => {
      evt.stopPropagation()

      if (onFocus) onFocus(evt)

      setActiveWindowId(windowId)
    },
    [onFocus, setActiveWindowId, windowId],
  )

  const windowRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (windowRef.current) windowRef.current.focus()
  }, [])

  return (
    <div
      ref={windowRef}
      tabIndex={-1}
      {...props}
      className={classNames(classes.wrapper, className)}
      onFocus={handleFocus}
    >
      {children}
    </div>
  )
}

export default KeyBindingsWindow
