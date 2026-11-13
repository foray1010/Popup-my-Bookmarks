import { type PropsWithChildren, useId, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useResizeObserver } from 'use-resize-observer'

import * as classes from './floating-window.module.css'
import useGlobalBodySize from './useGlobalBodySize.js'

type Props = Readonly<
  PropsWithChildren<{
    'aria-label': string
    positionLeft: number
    positionTop: number
    onClose: () => void
  }>
>
export default function FloatingWindow({
  'aria-label': ariaLabel,
  children,
  positionLeft,
  positionTop,
  onClose,
}: Props) {
  const { insertBodySize } = useGlobalBodySize()

  const windowRef = useRef<HTMLDialogElement>(null)
  const { height, width } = useResizeObserver({
    ref: windowRef,
    round: Math.ceil,
  })

  // top layer elements do not contribute to the popup size, so enlarge the body to fit the floating window
  useLayoutEffect(() => {
    if (height === undefined || width === undefined) return

    const { removeBodySize } = insertBodySize({
      height: height > document.body.scrollHeight ? height : undefined,
      width: width > document.body.offsetWidth ? width : undefined,
    })
    return removeBodySize
  }, [height, insertBodySize, width])

  useLayoutEffect(() => {
    const windowElement = windowRef.current
    if (windowElement && !windowElement.open) windowElement.showModal()
  }, [])

  const anchorName = `--floating-window${useId()}`

  return createPortal(
    <>
      <div
        className={classes.anchor}
        style={{
          anchorName,
          left: `${positionLeft}px`,
          top: `${positionTop}px`,
        }}
      />
      <dialog
        ref={windowRef}
        aria-label={ariaLabel}
        className={classes.window}
        // eslint-disable-next-line react/no-unknown-property
        closedby='any'
        style={{ positionAnchor: anchorName }}
        onClose={onClose}
      >
        {children}
      </dialog>
    </>,
    document.body,
  )
}
