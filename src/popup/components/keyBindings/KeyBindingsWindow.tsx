import { type PropsWithChildren, useEffect, useRef } from 'react'
import type { ValueOf } from 'type-fest'

import type { WindowId } from '@/popup/constants/windows.js'

import { useKeyBindingsContext } from './KeyBindingsContext.js'
import * as classes from './KeyBindingsWindow.module.css'

type Props = Readonly<
  PropsWithChildren<{
    windowId: ValueOf<typeof WindowId>
  }>
>
export default function KeyBindingsWindow({ children, windowId }: Props) {
  const { activeWindowId, appendActiveWindowId, removeActiveWindowId } =
    useKeyBindingsContext()

  useEffect(() => {
    appendActiveWindowId(windowId)

    return () => {
      removeActiveWindowId(windowId)
    }
  }, [appendActiveWindowId, removeActiveWindowId, windowId])

  const isInert = activeWindowId !== windowId

  const windowRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
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
      className={classes.window}
      inert={isInert}
      tabIndex={-1}
    >
      {children}
    </div>
  )
}
