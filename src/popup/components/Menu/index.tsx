import * as React from 'react'
import { useSelector } from 'react-redux'

import useAction from '../../../core/hooks/useAction'
import * as CST from '../../constants'
import { MENU_WINDOW } from '../../constants/windows'
import type { RootState } from '../../reduxs'
import { menuCreators } from '../../reduxs'
import isMac from '../../utils/isMac'
import AbsolutePosition from '../absolutePosition/AbsolutePosition'
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

const MenuContainer = () => {
  const menuPattern = useSelector((state: RootState) => state.menu.menuPattern)
  const positionLeft = useSelector(
    (state: RootState) => state.menu.positionLeft,
  )
  const positionTop = useSelector((state: RootState) => state.menu.positionTop)
  const unclickableRows = useSelector(unclickableRowsSelector)

  const clickMenuRow = useAction(menuCreators.clickMenuRow)
  const closeMenu = useAction(menuCreators.closeMenu)

  const {
    lists,
    setHighlightedIndex,
    unsetHighlightedIndex,
    setItemCount,
  } = React.useContext(ListNavigationContext)

  const allRowNames = React.useMemo(() => menuPattern.flat(), [menuPattern])
  const highlightedIndex = lists.highlightedIndices.get(0)

  React.useEffect(() => {
    setItemCount(0, allRowNames.length)
  }, [allRowNames.length, setItemCount])

  useKeyboardNav({ windowId: MENU_WINDOW })

  const handleRowClick = React.useCallback(() => {
    if (highlightedIndex === undefined) return

    const rowKey = allRowNames[highlightedIndex]
    if (!rowKey) return

    clickMenuRow(rowKey)
    closeMenu()
  }, [allRowNames, clickMenuRow, closeMenu, highlightedIndex])

  useKeyBindingsEvent({ key: 'Enter', windowId: MENU_WINDOW }, handleRowClick)
  useKeyBindingsEvent(
    { key: isMac() ? 'Control' : 'ContextMenu', windowId: MENU_WINDOW },
    closeMenu,
  )

  const handleRowMouseEnter = React.useCallback(
    (index: number) => () => {
      setHighlightedIndex(0, index)
    },
    [setHighlightedIndex],
  )

  const handleRowMouseLeave = React.useCallback(
    (index: number) => () => {
      unsetHighlightedIndex(0, index)
    },
    [unsetHighlightedIndex],
  )

  return (
    <>
      <Mask opacity={0.3} onClick={closeMenu} />
      <AbsolutePosition positionLeft={positionLeft} positionTop={positionTop}>
        <KeyBindingsWindow windowId={MENU_WINDOW}>
          <Menu
            highlightedIndex={highlightedIndex}
            menuPattern={menuPattern}
            onRowClick={handleRowClick}
            onRowMouseEnter={handleRowMouseEnter}
            onRowMouseLeave={handleRowMouseLeave}
            unclickableRows={unclickableRows}
          />
        </KeyBindingsWindow>
      </AbsolutePosition>
    </>
  )
}

const MenuContainerWithProviders = () => (
  <ListNavigationProvider>
    <MenuContainer />
  </ListNavigationProvider>
)

export default MenuContainerWithProviders
