import * as R from 'ramda'
import * as React from 'react'
import Measure, {ContentRect} from 'react-measure'
import styled, {createGlobalStyle} from 'styled-components'

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

interface WrapperProps {
  children: React.ReactNode
  positionLeft: number
  positionTop: number
}
const Wrapper = styled('div')<WrapperProps>`
  left: ${R.prop('positionLeft')}px;
  position: absolute;
  top: ${R.prop('positionTop')}px;
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

  return (
    <React.Fragment>
      <GlobalStyles bodyHeight={bodySize.height} bodyWidth={bodySize.width} />
      <Measure offset onResize={measureOnResize}>
        {({measureRef}) => (
          <Wrapper
            ref={measureRef}
            positionLeft={calibratedPosition.left}
            positionTop={calibratedPosition.top}
          >
            {restProps.children}
          </Wrapper>
        )}
      </Measure>
    </React.Fragment>
  )
}

export default AbsPositionWithinBody
