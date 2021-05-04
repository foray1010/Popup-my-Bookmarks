import useComponentSize from '@rehooks/component-size'
import * as React from 'react'

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

  const measureRef = React.useRef<HTMLDivElement>(null)
  const childSize = useComponentSize(measureRef)

  const [calibratedPosition, setCalibratedPosition] = React.useState({
    left: 0,
    top: 0,
  })

  React.useEffect(() => {
    const currentBodyHeight = document.body.scrollHeight
    const currentBodyWidth = document.body.offsetWidth

    const updatedBodyHeight =
      childSize.height > currentBodyHeight ? childSize.height : undefined
    const updatedBodyWidth =
      childSize.width > currentBodyWidth ? childSize.width : undefined

    setCalibratedPosition({
      left: Math.min(
        positionLeft,
        (updatedBodyWidth !== undefined ? updatedBodyWidth : currentBodyWidth) -
          childSize.width,
      ),
      top: Math.min(
        positionTop,
        (updatedBodyHeight !== undefined
          ? updatedBodyHeight
          : currentBodyHeight) - childSize.height,
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
    childSize.height,
    childSize.width,
    insertBodySize,
    positionLeft,
    positionTop,
  ])

  return (
    <div
      ref={measureRef}
      style={React.useMemo(
        () => ({
          position: 'fixed',
          left: `${calibratedPosition.left}px`,
          top: `${calibratedPosition.top}px`,
        }),
        [calibratedPosition.left, calibratedPosition.top],
      )}
    >
      {children}
    </div>
  )
}
