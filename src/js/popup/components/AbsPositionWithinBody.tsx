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
interface State {
  bodyHeight: number | null
  bodyWidth: number | null
  calibratedLeft: number
  calibratedTop: number
  mainHeight: number
  mainWidth: number
}
class AbsPositionWithinBody extends React.PureComponent<Props, State> {
  public state = {
    bodyHeight: null,
    bodyWidth: null,
    calibratedLeft: 0,
    calibratedTop: 0,
    mainHeight: 0,
    mainWidth: 0
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevProps.positionLeft !== this.props.positionLeft ||
      prevProps.positionTop !== this.props.positionTop ||
      prevState.mainHeight !== this.state.mainHeight ||
      prevState.mainWidth !== this.state.mainWidth
    ) {
      this.setPosition()
    }
  }

  private setPosition = () => {
    if (!document.body) return

    const currentBodyHeight = document.body.scrollHeight
    const currentBodyWidth = document.body.scrollWidth
    const menuHeight = this.state.mainHeight
    const menuWidth = this.state.mainWidth

    const updatedBodyHeight = menuHeight > currentBodyHeight ? menuHeight : null
    const updatedBodyWidth = menuWidth > currentBodyWidth ? menuWidth : null

    this.setState({
      bodyHeight: updatedBodyHeight,
      bodyWidth: updatedBodyWidth,
      calibratedLeft: Math.min(
        this.props.positionLeft,
        (updatedBodyWidth !== null ? updatedBodyWidth : currentBodyWidth) - menuWidth
      ),
      calibratedTop: Math.min(
        this.props.positionTop,
        (updatedBodyHeight !== null ? updatedBodyHeight : currentBodyHeight) - menuHeight
      )
    })
  }

  private measureOnResize = (contentRect: ContentRect) => {
    if (!contentRect.offset) return

    this.setState({
      mainHeight: contentRect.offset.height,
      mainWidth: contentRect.offset.width
    })
  }

  public render = () => (
    <React.Fragment>
      <GlobalStyles bodyHeight={this.state.bodyHeight} bodyWidth={this.state.bodyWidth} />
      <Measure offset onResize={this.measureOnResize}>
        {({measureRef}) => (
          <Wrapper
            ref={measureRef}
            positionLeft={this.state.calibratedLeft}
            positionTop={this.state.calibratedTop}
          >
            {this.props.children}
          </Wrapper>
        )}
      </Measure>
    </React.Fragment>
  )
}

export default AbsPositionWithinBody
