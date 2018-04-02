// @flow
// @jsx createElement

import * as R from 'ramda'
import {Fragment, PureComponent, createElement} from 'react'
import type {Node} from 'react'
import styled from 'react-emotion'
import {Helmet} from 'react-helmet'
import Measure from 'react-measure'

const Wrapper = styled('div')`
  left: ${R.prop('positionLeft')}px;
  position: absolute;
  top: ${R.prop('positionTop')}px;
`

type Props = {|
  children: Node,
  positionLeft: number,
  positionTop: number
|}
type State = {|
  bodyHeight: ?number,
  bodyWidth: ?number,
  calibratedLeft: number,
  calibratedTop: number,
  mainHeight: number,
  mainWidth: number
|}
class AbsPositionWithinBody extends PureComponent<Props, State> {
  state = {
    bodyHeight: null,
    bodyWidth: null,
    calibratedLeft: 0,
    calibratedTop: 0,
    mainHeight: 0,
    mainWidth: 0
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevProps.positionLeft !== this.props.positionLeft ||
      prevProps.positionTop !== this.props.positionTop ||
      prevState.mainHeight !== this.state.mainHeight ||
      prevState.mainWidth !== this.state.mainWidth
    ) {
      this.setPosition()
    }
  }

  setPosition = () => {
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
        (updatedBodyWidth || currentBodyWidth) - menuWidth
      ),
      calibratedTop: Math.min(
        this.props.positionTop,
        (updatedBodyHeight || currentBodyHeight) - menuHeight
      )
    })
  }

  measureOnResize = (contentRect: {| offset: {| height: number, width: number |} |}) => {
    this.setState({
      mainHeight: contentRect.offset.height,
      mainWidth: contentRect.offset.width
    })
  }

  render = () => (
    <Fragment>
      <Helmet>
        <style>
          {`
            body {
              ${this.state.bodyHeight ? `height: ${this.state.bodyHeight}px;` : ''}
              ${this.state.bodyWidth ? `width: ${this.state.bodyWidth}px;` : ''}
            }
          `}
        </style>
      </Helmet>
      <Measure offset onResize={this.measureOnResize}>
        {({measureRef}) => (
          <Wrapper
            innerRef={measureRef}
            positionLeft={this.state.calibratedLeft}
            positionTop={this.state.calibratedTop}
          >
            {this.props.children}
          </Wrapper>
        )}
      </Measure>
    </Fragment>
  )
}

export default AbsPositionWithinBody
