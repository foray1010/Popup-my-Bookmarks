import * as React from 'react'
import Measure, {ContentRect} from 'react-measure'
import {createGlobalStyle} from 'styled-components'

import classes from './index.css'

interface GlobalStylesProps {
  bodyHeight: number | null
  bodyWidth: number | null
}
const GlobalStyles = createGlobalStyle<GlobalStylesProps>`
  body {
    height: ${(props) => (props.bodyHeight != null ? `${props.bodyHeight}px` : 'auto')};
    width: ${(props) => (props.bodyWidth != null ? `${props.bodyWidth}px` : 'auto')};
  }
`

interface Props {
  children: React.ReactNode
  positionLeft: number
  positionTop: number
}
const AbsPositionWithinBody = ({positionLeft, positionTop, ...restProps}: Props) => {
  const [bodySize, setBodySize] = React.useState<{
    height: number | null
    width: number | null
  }>({
    height: null,
    width: null
  })
  const [childSize, setChildSize] = React.useState({
    height: 0,
    width: 0
  })
  const [calibratedPosition, setCalibratedPosition] = React.useState({
    left: 0,
    top: 0
  })

  React.useEffect(() => {
    if (!document.body) return

    const currentBodyHeight = document.body.scrollHeight
    const currentBodyWidth = document.body.scrollWidth

    const updatedBodyHeight = childSize.height > currentBodyHeight ? childSize.height : null
    const updatedBodyWidth = childSize.width > currentBodyWidth ? childSize.width : null

    setBodySize({
      height: updatedBodyHeight,
      width: updatedBodyWidth
    })

    setCalibratedPosition({
      left: Math.min(
        positionLeft,
        (updatedBodyWidth !== null ? updatedBodyWidth : currentBodyWidth) - childSize.width
      ),
      top: Math.min(
        positionTop,
        (updatedBodyHeight !== null ? updatedBodyHeight : currentBodyHeight) - childSize.height
      )
    })
  }, [childSize, positionLeft, positionTop])

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
    <React.Fragment>
      <GlobalStyles bodyHeight={bodySize.height} bodyWidth={bodySize.width} />
      <Measure offset onResize={measureOnResize}>
        {({measureRef}) => (
          <div ref={measureRef} className={classes.wrapper} style={wrapperStyles}>
            {restProps.children}
          </div>
        )}
      </Measure>
    </React.Fragment>
  )
}

export default AbsPositionWithinBody
