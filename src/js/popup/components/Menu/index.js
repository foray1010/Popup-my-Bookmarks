// @flow
// @jsx createElement

import '../../../../css/popup/mask.css'

import * as R from 'ramda'
import {Fragment, PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import {menuCreators} from '../../reduxs'
import type {MenuPattern} from '../../types'
import Mask from '../Mask'
import Menu from './Menu'

type Props = {|
  closeMenu: () => void,
  focusedRow: string,
  menuPattern: MenuPattern,
  positionLeft: number,
  positionTop: number,
  removeFocusedRow: () => void,
  setFocusedRow: (string) => void
|}
class MenuContainer extends PureComponent<Props> {
  handleClick = () => () => {
    this.props.closeMenu()
  }

  handleMouseEnter = (rowKey: string) => () => {
    this.props.setFocusedRow(rowKey)
  }

  handleMouseLeave = () => {
    this.props.removeFocusedRow()
  }

  render = () => (
    <Fragment>
      <Mask onClick={this.props.closeMenu} />
      <Menu
        focusedRow={this.props.focusedRow}
        menuPattern={this.props.menuPattern}
        positionLeft={this.props.positionLeft}
        positionTop={this.props.positionTop}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      />
    </Fragment>
  )
}

const mapStateToProps = R.prop('menu')

const mapDispatchToProps = R.pick(['closeMenu', 'removeFocusedRow', 'setFocusedRow'], menuCreators)

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer)
