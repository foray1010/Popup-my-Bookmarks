import * as R from 'ramda'
import * as React from 'react'
import {connect} from 'react-redux'

import * as CST from '../../constants'
import {MENU_WINDOW} from '../../constants/windows'
import {RootState, menuCreators} from '../../reduxs'
import isMac from '../../utils/isMac'
import AbsPositionWithinBody from '../AbsPositionWithinBody'
import KeyBindingsWindow from '../keyBindings/KeyBindingsWindow'
import useKeyBindingsEvent from '../keyBindings/useKeyBindingsEvent'
import ListNavigationContext from '../listNavigation/ListNavigationContext'
import ListNavigationProvider from '../listNavigation/ListNavigationProvider'
import useKeyboardNav from '../listNavigation/useKeyboardNav'
import Mask from '../Mask'
import Menu from './Menu'

const unclickableRowsSelector = (state: RootState) => {
  if (!state.bookmark.clipboard.id) return [CST.MENU_PASTE]
  return []
}

const mapStateToProps = (state: RootState) => ({
  menuPattern: state.menu.menuPattern,
  positionLeft: state.menu.positionLeft,
  positionTop: state.menu.positionTop,
  unclickableRows: unclickableRowsSelector(state)
})

const mapDispatchToProps = {
  clickMenuRow: menuCreators.clickMenuRow,
  closeMenu: menuCreators.closeMenu
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
const MenuContainer = ({clickMenuRow, closeMenu, menuPattern, ...restProps}: Props) => {
  const {lists, setHighlightedIndex, unsetHighlightedIndex, setItemCount} = React.useContext(
    ListNavigationContext
  )

  const allRowNames = React.useMemo(() => menuPattern.reduce(R.concat, []), [menuPattern])
  const highlightedIndex = lists.highlightedIndices.get(0)

  React.useEffect(() => {
    setItemCount(0, allRowNames.length)
  }, [allRowNames.length, setItemCount])

  useKeyboardNav({windowId: MENU_WINDOW})

  const handleRowClick = React.useCallback(() => {
    if (highlightedIndex === undefined) return

    const rowKey = allRowNames[highlightedIndex]
    if (!rowKey) return

    clickMenuRow(rowKey)
    closeMenu()
  }, [allRowNames, clickMenuRow, closeMenu, highlightedIndex])

  useKeyBindingsEvent({key: 'Enter', windowId: MENU_WINDOW}, handleRowClick)
  useKeyBindingsEvent({key: isMac() ? 'Control' : 'ContextMenu', windowId: MENU_WINDOW}, closeMenu)

  const handleRowMouseEnter = React.useCallback(
    (index: number) => () => {
      setHighlightedIndex(0, index)
    },
    [setHighlightedIndex]
  )

  const handleRowMouseLeave = React.useCallback(
    (index: number) => () => {
      unsetHighlightedIndex(0, index)
    },
    [unsetHighlightedIndex]
  )

  return (
    <React.Fragment>
      <Mask backgroundColor='#fff' opacity={0.3} onClick={closeMenu} />
      <AbsPositionWithinBody
        positionLeft={restProps.positionLeft}
        positionTop={restProps.positionTop}
      >
        <KeyBindingsWindow windowId={MENU_WINDOW}>
          <Menu
            highlightedIndex={highlightedIndex}
            menuPattern={menuPattern}
            onRowClick={handleRowClick}
            onRowMouseEnter={handleRowMouseEnter}
            onRowMouseLeave={handleRowMouseLeave}
            unclickableRows={restProps.unclickableRows}
          />
        </KeyBindingsWindow>
      </AbsPositionWithinBody>
    </React.Fragment>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)((props: Props) => (
  <ListNavigationProvider>
    <MenuContainer {...props} />
  </ListNavigationProvider>
))
