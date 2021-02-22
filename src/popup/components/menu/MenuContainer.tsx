import * as React from 'react'
import { useSelector } from 'react-redux'
import webExtension from 'webextension-polyfill'

import useAction from '../../../core/hooks/useAction'
import * as CST from '../../constants'
import { MENU_WINDOW } from '../../constants/windows'
import { useGetBookmarkInfo } from '../../hooks/bookmarks'
import { bookmarkCreators, RootState } from '../../reduxs'
import isMac from '../../utils/isMac'
import { AbsolutePosition } from '../absolutePosition'
import { useEditorContext } from '../editor'
import { KeyBindingsWindow, useKeyBindingsEvent } from '../keyBindings'
import {
  ListNavigationProvider,
  useKeyboardNav,
  useListNavigationContext,
} from '../listNavigation'
import Mask from '../Mask'
import Menu from './Menu'
import { useMenuContext } from './useMenu'
import { getMenuPattern } from './utils'

const useClickMenuRow = (rowName?: string) => {
  const { close, state } = useMenuContext()
  const { open: openEditor } = useEditorContext()

  const { data: bookmarkInfo } = useGetBookmarkInfo(
    state.isOpen ? state.targetId : undefined,
  )

  const addCurrentPage = useAction(bookmarkCreators.addCurrentPage)
  const addSeparator = useAction(bookmarkCreators.addSeparator)
  const copyBookmark = useAction(bookmarkCreators.copyBookmark)
  const cutBookmark = useAction(bookmarkCreators.cutBookmark)
  const deleteBookmark = useAction(bookmarkCreators.deleteBookmark)
  const openBookmarksInBrowser = useAction(
    bookmarkCreators.openBookmarksInBrowser,
  )
  const pasteBookmark = useAction(bookmarkCreators.pasteBookmark)
  const sortBookmarksByName = useAction(bookmarkCreators.sortBookmarksByName)

  return React.useCallback(async () => {
    if (!state.isOpen || !bookmarkInfo) return

    switch (rowName) {
      case CST.MENU_ADD_FOLDER:
        openEditor({
          createAfterId: bookmarkInfo.id,
          isAllowedToEditUrl: false,
          isCreating: true,
          positions: state.targetPositions,
        })
        break

      case CST.MENU_ADD_PAGE:
        addCurrentPage(bookmarkInfo.parentId, bookmarkInfo.storageIndex + 1)
        break

      case CST.MENU_ADD_SEPARATOR:
        addSeparator(bookmarkInfo.parentId, bookmarkInfo.storageIndex + 1)
        break

      case CST.MENU_COPY:
        copyBookmark(bookmarkInfo.id)
        break

      case CST.MENU_CUT:
        cutBookmark(bookmarkInfo.id)
        break

      case CST.MENU_DEL:
        deleteBookmark(bookmarkInfo.id)
        break

      case CST.MENU_EDIT:
      case CST.MENU_RENAME:
        openEditor({
          editTargetId: bookmarkInfo.id,
          isAllowedToEditUrl: bookmarkInfo.type !== CST.BOOKMARK_TYPES.FOLDER,
          isCreating: false,
          positions: state.targetPositions,
        })
        break

      case CST.MENU_OPEN_ALL:
      case CST.MENU_OPEN_ALL_IN_I:
      case CST.MENU_OPEN_ALL_IN_N: {
        const childrenIds = (
          await webExtension.bookmarks.getChildren(bookmarkInfo.id)
        ).map((x) => x.id)

        const mapping = {
          [CST.MENU_OPEN_ALL]: CST.OPEN_IN_TYPES.BACKGROUND_TAB,
          [CST.MENU_OPEN_ALL_IN_I]: CST.OPEN_IN_TYPES.INCOGNITO_WINDOW,
          [CST.MENU_OPEN_ALL_IN_N]: CST.OPEN_IN_TYPES.NEW_WINDOW,
        }
        openBookmarksInBrowser(childrenIds, {
          openIn: mapping[rowName],
          isAllowBookmarklet: false,
          isCloseThisExtension: true,
        })
        break
      }

      case CST.MENU_OPEN_IN_B:
      case CST.MENU_OPEN_IN_I:
      case CST.MENU_OPEN_IN_N: {
        const mapping = {
          [CST.MENU_OPEN_IN_B]: CST.OPEN_IN_TYPES.BACKGROUND_TAB,
          [CST.MENU_OPEN_IN_I]: CST.OPEN_IN_TYPES.INCOGNITO_WINDOW,
          [CST.MENU_OPEN_IN_N]: CST.OPEN_IN_TYPES.NEW_WINDOW,
        }
        openBookmarksInBrowser([bookmarkInfo.id], {
          openIn: mapping[rowName],
          isAllowBookmarklet: true,
          isCloseThisExtension: true,
        })
        break
      }

      case CST.MENU_PASTE:
        pasteBookmark(bookmarkInfo.parentId, bookmarkInfo.storageIndex + 1)
        break

      case CST.MENU_SORT_BY_NAME:
        sortBookmarksByName(bookmarkInfo.parentId)
        break

      default:
    }

    close()
  }, [
    addCurrentPage,
    addSeparator,
    bookmarkInfo,
    close,
    copyBookmark,
    cutBookmark,
    deleteBookmark,
    openBookmarksInBrowser,
    openEditor,
    pasteBookmark,
    rowName,
    sortBookmarksByName,
    state,
  ])
}

const InnerMenuContainer = () => {
  const isSearching = useSelector((state: RootState) =>
    Boolean(state.bookmark.searchKeyword),
  )
  const unclickableRows = useSelector((state: RootState) => {
    if (!state.bookmark.clipboard.id) return [CST.MENU_PASTE]
    return []
  })

  const { close, state } = useMenuContext()

  const { data: bookmarkInfo } = useGetBookmarkInfo(
    state.isOpen ? state.targetId : undefined,
  )
  const menuPattern = React.useMemo(() => {
    return bookmarkInfo ? getMenuPattern(bookmarkInfo, isSearching) : []
  }, [bookmarkInfo, isSearching])

  const {
    listNavigation,
    setHighlightedIndex,
    unsetHighlightedIndex,
    setItemCount,
  } = useListNavigationContext()

  const allRowNames = React.useMemo(() => menuPattern.flat(), [menuPattern])
  const highlightedIndex = listNavigation.highlightedIndices.get(0)

  React.useEffect(() => {
    setItemCount(0, allRowNames.length)
  }, [allRowNames.length, setItemCount])

  useKeyboardNav({ windowId: MENU_WINDOW })

  const handleRowClick = useClickMenuRow(
    highlightedIndex !== undefined ? allRowNames[highlightedIndex] : undefined,
  )

  useKeyBindingsEvent({ key: 'Enter', windowId: MENU_WINDOW }, handleRowClick)
  useKeyBindingsEvent(
    { key: isMac() ? 'Control' : 'ContextMenu', windowId: MENU_WINDOW },
    close,
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

  if (!state.isOpen) return null

  return (
    <>
      <Mask opacity={0.3} onClick={close} />
      <AbsolutePosition
        positionLeft={state.displayPositions.left}
        positionTop={state.displayPositions.top}
      >
        <KeyBindingsWindow windowId={MENU_WINDOW}>
          <Menu
            highlightedIndex={highlightedIndex}
            menuPattern={menuPattern}
            unclickableRows={unclickableRows}
            onRowClick={handleRowClick}
            onRowMouseEnter={handleRowMouseEnter}
            onRowMouseLeave={handleRowMouseLeave}
          />
        </KeyBindingsWindow>
      </AbsolutePosition>
    </>
  )
}

export default function MenuContainer() {
  return (
    <ListNavigationProvider>
      <InnerMenuContainer />
    </ListNavigationProvider>
  )
}
