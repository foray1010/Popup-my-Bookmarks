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
const MenuContainer = ({clickMenuRow, closeMenu, setFocusedRow, ...restProps}: Props) => {
  const handleRowClick = React.useCallback(
    (rowKey: string) => () => {
      clickMenuRow(rowKey)
      closeMenu()
    },
    [clickMenuRow, closeMenu]
  )

  const handleRowMouseEnter = React.useCallback(
    (rowKey: string) => () => {
      setFocusedRow(rowKey)
    },
    [setFocusedRow]
  )

  return (
    <React.Fragment>
      <Mask backgroundColor='#fff' opacity={0.3} onClick={closeMenu} />
      <AbsPositionWithinBody
        positionLeft={restProps.positionLeft}
        positionTop={restProps.positionTop}
      >
        <Menu
          focusedRow={restProps.focusedRow}
          menuPattern={restProps.menuPattern}
          onRowClick={handleRowClick}
          onRowMouseEnter={handleRowMouseEnter}
          onRowMouseLeave={restProps.removeFocusedRow}
          unclickableRows={restProps.unclickableRows}
        />
      </AbsPositionWithinBody>
    </React.Fragment>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuContainer)
