// @flow
// @jsx createElement

import '../../../../css/popup/mask.css'

import * as R from 'ramda'
import {Fragment, PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

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
  setFocusedRow: (string) => void
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
        />
      </AbsPositionWithinBody>
    </Fragment>
  )
}

const mapStateToProps = R.prop('menu')

const mapDispatchToProps = R.pick(
  ['clickMenuRow', 'closeMenu', 'removeFocusedRow', 'setFocusedRow'],
  menuCreators
)

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer)
