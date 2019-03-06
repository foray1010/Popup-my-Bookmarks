import * as React from 'react'
import {connect} from 'react-redux'

import * as CST from '../../constants'
import {RootState, menuCreators} from '../../reduxs'
import AbsPositionWithinBody from '../AbsPositionWithinBody'
import Mask from '../Mask'
import Menu from './Menu'

const unclickableRowsSelector = (state: RootState) => {
  if (!state.bookmark.clipboard.id) return [CST.MENU_PASTE]
  return []
}

const mapStateToProps = (state: RootState) => ({
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

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
class MenuContainer extends React.PureComponent<Props> {
  private handleRowClick = (rowKey: string) => () => {
    this.props.clickMenuRow(rowKey)
    this.props.closeMenu()
  }

  private handleRowMouseEnter = (rowKey: string) => () => {
    this.props.setFocusedRow(rowKey)
  }

  private handleRowMouseLeave = () => {
    this.props.removeFocusedRow()
  }

  public render = () => (
    <React.Fragment>
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
    </React.Fragment>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuContainer)
