import * as React from 'react'
import { useSelector } from 'react-redux'

import useAction from '../../../core/hooks/useAction'
import withProviders from '../../../core/utils/withProviders'
import { BOOKMARK_TYPES, MenuItem, OPEN_IN_TYPES } from '../../constants'
import { MENU_WINDOW } from '../../constants/windows'
import {
  useBookmarkCurrentPage,
  useCreateSeparator,
} from '../../modules/bookmarks/hooks/createBookmark'
import useDeleteBookmark from '../../modules/bookmarks/hooks/useDeleteBookmark'
import useGetBookmarkInfo from '../../modules/bookmarks/hooks/useGetBookmarkInfo'
import {
  openBookmarksInBrowser,
  openFolderInBrowser,
} from '../../modules/bookmarks/methods/openBookmark'
import sortBookmarksByName from '../../modules/bookmarks/methods/sortBookmarksByName'
import { bookmarkCreators, RootState } from '../../reduxs'
import isMac from '../../utils/isMac'
import { useEditorContext } from '../editor'
import { FloatingWindow } from '../floatingWindow'
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

  const { mutate: bookmarkCurrentPage } = useBookmarkCurrentPage()
  const { mutate: createSeparator } = useCreateSeparator()
  const copyBookmark = useAction(bookmarkCreators.copyBookmark)
  const cutBookmark = useAction(bookmarkCreators.cutBookmark)
  const { mutate: deleteBookmark } = useDeleteBookmark()
  const pasteBookmark = useAction(bookmarkCreators.pasteBookmark)

  return React.useCallback(async () => {
    if (!state.isOpen || !bookmarkInfo) return

    switch (rowName) {
      case MenuItem.AddFolder:
        openEditor({
          createAfterId: bookmarkInfo.id,
          isAllowedToEditUrl: false,
          isCreating: true,
          positions: state.targetPositions,
        })
        break

      case MenuItem.AddPage:
        bookmarkCurrentPage({
          parentId: bookmarkInfo.parentId,
          index: bookmarkInfo.storageIndex + 1,
        })
        break

      case MenuItem.AddSeparator:
        createSeparator({
          parentId: bookmarkInfo.parentId,
          index: bookmarkInfo.storageIndex + 1,
        })
        break

      case MenuItem.Copy:
        copyBookmark(bookmarkInfo.id)
        break

      case MenuItem.Cut:
        cutBookmark(bookmarkInfo.id)
        break

      case MenuItem.Delete:
        deleteBookmark({ id: bookmarkInfo.id })
        break

      case MenuItem.Edit:
      case MenuItem.Rename:
        openEditor({
          editTargetId: bookmarkInfo.id,
          isAllowedToEditUrl: bookmarkInfo.type !== BOOKMARK_TYPES.FOLDER,
          isCreating: false,
          positions: state.targetPositions,
        })
        break

      case MenuItem.OpenAll:
      case MenuItem.OpenAllInIncognitoWindow:
      case MenuItem.OpenAllInNewWindow: {
        const mapping = {
          [MenuItem.OpenAll]: OPEN_IN_TYPES.BACKGROUND_TAB,
          [MenuItem.OpenAllInIncognitoWindow]: OPEN_IN_TYPES.INCOGNITO_WINDOW,
          [MenuItem.OpenAllInNewWindow]: OPEN_IN_TYPES.NEW_WINDOW,
        }
        await openFolderInBrowser(bookmarkInfo.id, {
          openIn: mapping[rowName],
          isAllowBookmarklet: false,
          isCloseThisExtension: true,
        })
        break
      }

      case MenuItem.OpenInBackgroundTab:
      case MenuItem.OpenInIncognitoWindow:
      case MenuItem.OpenInNewWindow: {
        const mapping = {
          [MenuItem.OpenInBackgroundTab]: OPEN_IN_TYPES.BACKGROUND_TAB,
          [MenuItem.OpenInIncognitoWindow]: OPEN_IN_TYPES.INCOGNITO_WINDOW,
          [MenuItem.OpenInNewWindow]: OPEN_IN_TYPES.NEW_WINDOW,
        }
        await openBookmarksInBrowser([bookmarkInfo.id], {
          openIn: mapping[rowName],
          isAllowBookmarklet: true,
          isCloseThisExtension: true,
        })
        break
      }

      case MenuItem.Paste:
        pasteBookmark(bookmarkInfo.parentId, bookmarkInfo.storageIndex + 1)
        break

      case MenuItem.SortByName:
        await sortBookmarksByName(bookmarkInfo.parentId)
        break

      default:
    }

    close()
  }, [
    bookmarkCurrentPage,
    bookmarkInfo,
    close,
    copyBookmark,
    createSeparator,
    cutBookmark,
    deleteBookmark,
    openEditor,
    pasteBookmark,
    rowName,
    state,
  ])
}

const InnerMenuContainer = () => {
  const isSearching = useSelector((state: RootState) =>
    Boolean(state.bookmark.searchKeyword),
  )
  const unclickableRows = useSelector((state: RootState) => {
    if (!state.bookmark.clipboard.id) return [MenuItem.Paste]
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
      <FloatingWindow
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
      </FloatingWindow>
    </>
  )
}

const MenuContainer = withProviders(InnerMenuContainer, [
  ListNavigationProvider,
])
export default MenuContainer
