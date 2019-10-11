import classNames from 'classnames'
import * as React from 'react'

import KeyBindingsContext from './KeyBindingsContext'
import classes from './KeyBindingsWindow.css'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  windowId: string
}
const KeyBindingsWindow = ({
  children,
  className,
  onFocus,
  windowId,
  ...attributes
}: Props) => {
  const { setActiveWindowId, unsetActiveWindowId } = React.useContext(
    KeyBindingsContext,
  )

  React.useEffect(() => {
    setActiveWindowId(windowId)

    return () => {
      unsetActiveWindowId(windowId)
    }
  }, [setActiveWindowId, unsetActiveWindowId, windowId])

  const handleFocus = React.useCallback(
    (evt: React.FocusEvent<HTMLDivElement>) => {
      evt.stopPropagation()

      if (onFocus) onFocus(evt)

      setActiveWindowId(windowId)
    },
    [onFocus, setActiveWindowId, windowId],
  )

  const divRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (divRef.current) divRef.current.focus()
  }, [])

  return (
    <div
      ref={divRef}
      tabIndex={-1}
      {...attributes}
      className={classNames(classes.wrapper, className)}
      onFocus={handleFocus}
    >
      {children}
    </div>
  )
}

export default KeyBindingsWindow
