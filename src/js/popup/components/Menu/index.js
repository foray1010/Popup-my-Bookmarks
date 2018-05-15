// @flow strict
// @jsx createElement

import '../../../../css/popup/mask.css'

import {Fragment, PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import * as CST from '../../constants'
import {menuCreators} from '../../reduxs'
import type {MenuPattern} from '../../types'
import AbsPositionWithinBody from '../AbsPositionWithinBody'
import Mask from '../Mask'
import Menu from './Menu'

type Props = {|
  clickMenuRow: (string) => void,
  closeMenu: () => void,
  focusedRow: string,
  menuPattern: MenuPattern,
  positionLeft: number,
  positionTop: number,
  removeFocusedRow: () => void,
  setFocusedRow: (string) => void,
  unclickableRows: Array<string>
|}
class MenuContainer extends PureComponent<Props> {
  handleRowClick = (rowKey: string) => () => {
    this.props.clickMenuRow(rowKey)
    this.props.closeMenu()
  }

  handleRowMouseEnter = (rowKey: string) => () => {
    this.props.setFocusedRow(rowKey)
  }

  handleRowMouseLeave = () => {
    this.props.removeFocusedRow()
  }

  render = () => (
    <Fragment>
      <Mask backgroundColor='#fff' opacity={0.3} onClick={this.props.closeMenu} />
      <AbsPositionWithinBody
        positionLeft={this.props.positionLeft}
        positionTop={this.props.positionTop}
      >
        <Menu
          focusedRow={this.props.focusedRow}
          menuPattern={this.props.menuPattern}
          onRowClick={this.handleRowClick}
          onRowMouseEnter={this.handleRowMouseEnter}
          onRowMouseLeave={this.handleRowMouseLeave}
          unclickableRows={this.props.unclickableRows}
        />
      </AbsPositionWithinBody>
    </Fragment>
  )
}

const unclickableRowsSelector = (state) => {
  if (!state.bookmark.clipboard.id) return [CST.MENU_PASTE]
  return []
}

const mapStateToProps = (state) => ({
  focusedRow: state.menu.focusedRow,
  menuPattern: state.menu.menuPattern,
  positionLeft: state.menu.positionLeft,
  positionTop: state.menu.positionTop,
  unclickableRows: unclickableRowsSelector(state)
})

const mapDispatchToProps = {
  clickMenuRow: menuCreators.clickMenuRow,
  closeMenu: menuCreators.closeMenu,
  removeFocusedRow: menuCreators.removeFocusedRow,
  setFocusedRow: menuCreators.setFocusedRow
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer)
