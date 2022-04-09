import * as React from 'react'
import useResizeObserver from 'use-resize-observer'

import useGlobalBodySize from './useGlobalBodySize'

interface Props {
  children: React.ReactNode
  positionLeft: number
  positionTop: number
}
export default function FloatingWindow({
  children,
  positionLeft,
  positionTop,
}: Props) {
  const { insertBodySize } = useGlobalBodySize()

  const [windowSize, setWindowSize] = React.useState<{
    height?: number
    width?: number
  }>({})
  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: setWindowSize,
    round: Math.ceil,
  })

  const [calibratedPosition, setCalibratedPosition] = React.useState<{
    left?: number
    top?: number
  }>({})

  React.useEffect(() => {
    if (windowSize.width === undefined || windowSize.height === undefined) {
      return
    }

    const currentBodyHeight = document.body.scrollHeight
    const currentBodyWidth = document.body.offsetWidth

    const updatedBodyHeight =
      windowSize.height > currentBodyHeight ? windowSize.height : undefined
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
  )
}
