// @flow
// @jsx createElement

import '../../../../css/popup/menu.css'

import * as R from 'ramda'
import {Fragment, PureComponent, createElement} from 'react'
import styled from 'react-emotion'
import {Helmet} from 'react-helmet'
import Measure from 'react-measure'

import type {MenuPattern} from '../../types'
import MenuRow from './MenuRow'

const Main = styled('div')`
  left: ${R.prop('positionLeft')}px;
  top: ${R.prop('positionTop')}px;
`

type Props = {|
  focusedRow: string,
  menuPattern: MenuPattern,
  onClick: (string) => () => void,
  onMouseEnter: (string) => () => void,
  onMouseLeave: () => void,
  positionLeft: number,
  positionTop: number
|}
type State = {|
  bodyHeight: ?number,
  bodyWidth: ?number,
  mainHeight: number,
  mainWidth: number,
  positionLeft: number,
  positionTop: number
|}
class Menu extends PureComponent<Props, State> {
  state = {
    bodyHeight: null,
    bodyWidth: null,
    mainHeight: 0,
    mainWidth: 0,
    positionLeft: this.props.positionLeft,
    positionTop: this.props.positionTop
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
      positionLeft: Math.min(
        this.props.positionLeft,
        (updatedBodyWidth || currentBodyWidth) - menuWidth
      ),
      positionTop: Math.min(
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

  mainEl: ?HTMLElement
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
          <Main
            innerRef={measureRef}
            styleName='main'
            positionLeft={this.state.positionLeft}
            positionTop={this.state.positionTop}
          >
            {this.props.menuPattern.map((menuFields) => (
              <div key={menuFields.join()}>
                {menuFields.map((rowName) => (
                  <MenuRow
                    key={rowName}
                    isFocused={rowName === this.props.focusedRow}
                    onClick={this.props.onClick}
                    onMouseEnter={this.props.onMouseEnter}
                    onMouseLeave={this.props.onMouseLeave}
                    rowName={rowName}
                  />
                ))}
              </div>
            ))}
          </Main>
        )}
      </Measure>
    </Fragment>
  )
}

export default Menu
