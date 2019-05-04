import * as React from 'react'
import Measure, {ContentRect} from 'react-measure'

import classes from './AbsolutePosition.css'
import useGlobalBodySize from './useGlobalBodySize'

interface Props {
  children: React.ReactNode
  positionLeft: number
  positionTop: number
}
const AbsolutePosition = ({positionLeft, positionTop, ...restProps}: Props) => {
  const {appendBodySize, removeBodySize} = useGlobalBodySize()

  const [childSize, setChildSize] = React.useState({
    height: 0,
    width: 0
  })
  const [calibratedPosition, setCalibratedPosition] = React.useState({
    left: 0,
    top: 0
  })

  React.useEffect(() => {
    if (!document.body) return undefined

    const currentBodyHeight = document.body.scrollHeight
    const currentBodyWidth = document.body.offsetWidth

    const updatedBodyHeight = childSize.height > currentBodyHeight ? childSize.height : undefined
    const updatedBodyWidth = childSize.width > currentBodyWidth ? childSize.width : undefined

    setCalibratedPosition({
      left: Math.min(
        positionLeft,
        (updatedBodyWidth !== undefined ? updatedBodyWidth : currentBodyWidth) - childSize.width
      ),
      top: Math.min(
        positionTop,
        (updatedBodyHeight !== undefined ? updatedBodyHeight : currentBodyHeight) - childSize.height
      )
    })

    const bodySize = {
      height: updatedBodyHeight,
      width: updatedBodyWidth
    }
    appendBodySize(bodySize)
    return () => {
      removeBodySize(bodySize)
    }
  }, [appendBodySize, childSize.height, childSize.width, positionLeft, positionTop, removeBodySize])

  const measureOnResize = React.useCallback((contentRect: ContentRect) => {
    if (!contentRect.offset) return

    setChildSize({
      height: contentRect.offset.height,
      width: contentRect.offset.width
    })
  }, [])

  const wrapperStyles = React.useMemo(
    (): object => ({
      '--positionLeft': `${calibratedPosition.left}px`,
      '--positionTop': `${calibratedPosition.top}px`
    }),
    [calibratedPosition.left, calibratedPosition.top]
  )

  return (
    <Measure offset onResize={measureOnResize}>
      {({measureRef}) => (
        <div ref={measureRef} className={classes.wrapper} style={wrapperStyles}>
          {restProps.children}
        </div>
      )}
    </Measure>
  )
}

export default AbsolutePosition
