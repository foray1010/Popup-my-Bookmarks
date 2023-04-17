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
  const { activeWindowId, appendActiveWindowId, removeActiveWindowId } =
    useKeyBindingsContext()

  React.useEffect(() => {
    appendActiveWindowId(windowId)

    return () => {
      removeActiveWindowId(windowId)
    }
  }, [appendActiveWindowId, removeActiveWindowId, windowId])

  const isInert = activeWindowId !== windowId

  const windowRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    // this element is `inert` at the beginning and it is not focusable
    if (!isInert) {
      // this function must run after other window is set to `inert`, because whenever that happens, the `document.activeElement` will be reset to the `document.body` in Chrome 102. The hacky way to fix it is to wrap it within `requestAnimationFrame`.
      requestAnimationFrame(() => {
        // when right clicking an bookmark to open menu, then pressing arrow up/down key, the bookmark tree will scroll together. We need to focus to the window to prevent this.
        windowRef.current?.focus()
      })
    }
  }, [isInert])

  return (
    <div
      ref={windowRef}
      className={classes['window']}
      // @ts-expect-error not officially supported by React: https://github.com/facebook/react/pull/24730
      inert={isInert ? '' : undefined}
      tabIndex={-1}
    >
      {children}
    </div>
  )
}
