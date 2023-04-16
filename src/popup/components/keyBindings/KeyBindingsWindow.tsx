import * as React from 'react'

import type { WindowId } from '../../constants/windows.js'
import { useKeyBindingsContext } from './KeyBindingsContext.js'
import classes from './KeyBindingsWindow.module.css'

type Props = Readonly<
  React.PropsWithChildren<{
    windowId: WindowId
  }>
>
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
    // when right clicking an bookmark to open menu, then pressing arrow up/down key, the bookmark tree will scroll together. We need to focus to the window to prevent this.
    windowRef.current?.focus()
  }, [])

  return (
    <div ref={windowRef} className={classes['window']} tabIndex={-1}>
      {children}
    </div>
  )
}
