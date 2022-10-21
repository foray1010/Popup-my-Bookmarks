import { Portal } from '@reach/portal'
import * as React from 'react'
import useResizeObserver from 'use-resize-observer'

import Mask from '../Mask/index.js'
import useGlobalBodySize from './useGlobalBodySize.js'

interface Props {
  readonly children: React.ReactNode
  readonly positionLeft: number
  readonly positionTop: number
  readonly onClose: () => void
}
export default function FloatingWindow({
  children,
  positionLeft,
  positionTop,
  onClose,
}: Props) {
  const { insertBodySize } = useGlobalBodySize()

  const [windowSize, setWindowSize] = React.useState<{
    height?: number | undefined
    width?: number | undefined
  }>({})
  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: setWindowSize,
    round: Math.ceil,
  })

  const [calibratedPosition, setCalibratedPosition] = React.useState<{
    left?: number | undefined
    top?: number | undefined
  }>({})

  React.useEffect(() => {
    if (windowSize.width === undefined || windowSize.height === undefined) {
      return
    }

    const currentBodyHeight = document.body.scrollHeight
    const updatedBodyHeight =
      windowSize.height > currentBodyHeight ? windowSize.height : undefined

    const currentBodyWidth = document.body.offsetWidth
    const updatedBodyWidth =
      windowSize.width > currentBodyWidth ? windowSize.width : undefined

    setCalibratedPosition({
      left: Math.min(
        positionLeft,
        (updatedBodyWidth ?? currentBodyWidth) - windowSize.width,
      ),
      top: Math.min(
        positionTop,
        (updatedBodyHeight ?? currentBodyHeight) - windowSize.height,
      ),
    })

    const { removeBodySize } = insertBodySize({
      height: updatedBodyHeight,
      width: updatedBodyWidth,
    })
    return () => {
      removeBodySize()
    }
  }, [
    insertBodySize,
    positionLeft,
    positionTop,
    windowSize.height,
    windowSize.width,
  ])

  return (
    <Portal>
      <Mask opacity={0.3} onClick={onClose} />
      <div
        ref={ref}
        style={React.useMemo(
          () => ({
            position: 'fixed',
            left: `${calibratedPosition.left ?? 0}px`,
            top: `${calibratedPosition.top ?? 0}px`,
          }),
          [calibratedPosition.left, calibratedPosition.top],
        )}
      >
        {children}
      </div>
    </Portal>
  )
}
