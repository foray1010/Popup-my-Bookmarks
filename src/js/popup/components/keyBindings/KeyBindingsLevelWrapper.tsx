import classNames from 'classnames'
import * as React from 'react'

import KeyBindingsContext from './KeyBindingsContext'
import classes from './KeyBindingsLevelWrapper.css'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  level?: number
}
const KeyBindingsLevelWrapper = ({
  children,
  className,
  level = 0,
  onFocus,
  ...attributes
}: Props) => {
  const divRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (divRef.current) divRef.current.focus()
  }, [])

  const {setLayerLevel} = React.useContext(KeyBindingsContext)

  const handleFocus = React.useCallback(
    (evt: React.FocusEvent<HTMLDivElement>) => {
      evt.stopPropagation()

      if (onFocus) onFocus(evt)

      setLayerLevel(level)
    },
    [level, onFocus, setLayerLevel]
  )

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

export default KeyBindingsLevelWrapper
