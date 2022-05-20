import * as React from 'react'
import webExtension from 'webextension-polyfill'

import withProviders from '../../../core/utils/withProviders'
import { BOOKMARK_TYPES, MenuItem, OPEN_IN_TYPES } from '../../constants'
import { MENU_WINDOW } from '../../constants/windows'
import { useBookmarkTrees } from '../../modules/bookmarks/contexts/bookmarkTrees'
import useGetBookmarkInfo from '../../modules/bookmarks/hooks/useGetBookmarkInfo'
import { recursiveCopyBookmarks } from '../../modules/bookmarks/methods/copyBookmark'
import {
  bookmarkCurrentPage,
  createSeparator,
} from '../../modules/bookmarks/methods/createBookmark'
import {
  openBookmarksInBrowser,
  openFolderInBrowser,
} from '../../modules/bookmarks/methods/openBookmark'
import sortBookmarksByName from '../../modules/bookmarks/methods/sortBookmarksByName'
import isMac from '../../utils/isMac'
import { ClipboardAction, useClipboard } from '../clipboard'
import { useEditorContext } from '../editor'
import { FloatingWindow } from '../floatingWindow'
import { KeyBindingsWindow, useKeyBindingsEvent } from '../keyBindings'
import {
  ListNavigationProvider,
  useKeyboardNav,
  useListNavigationContext,
} from '../listNavigation'
import Menu from './Menu'
import { useMenuContext } from './useMenu'
import { getMenuPattern } from './utils'

const useClickMenuRow = (rowName?: string) => {
  const { close, state } = useMenuContext()
  const { open: openEditor } = useEditorContext()

  const {
    reset: resetClipboard,
    set: setClipboard,
    state: clipboardState,
  } = useClipboard()

  const { data: bookmarkInfo } = useGetBookmarkInfo(
    state.isOpen ? state.targetId : undefined,
  )

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
        await bookmarkCurrentPage({
          parentId: bookmarkInfo.parentId,
          index: bookmarkInfo.storageIndex + 1,
        })
        break

      case MenuItem.AddSeparator:
        await createSeparator({
          parentId: bookmarkInfo.parentId,
          index: bookmarkInfo.storageIndex + 1,
        })
        break

      case MenuItem.Copy:
        setClipboard({
          action: ClipboardAction.Copy,
          items: [{ id: bookmarkInfo.id }],
        })
        break

      case MenuItem.Cut:
        setClipboard({
          action: ClipboardAction.Cut,
          items: [{ id: bookmarkInfo.id }],
        })
        break

      case MenuItem.Delete:
        await webExtension.bookmarks.removeTree(bookmarkInfo.id)
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
        switch (clipboardState.action) {
          case ClipboardAction.Copy:
            await recursiveCopyBookmarks(clipboardState.items[0].id, {
              parentId: bookmarkInfo.parentId,
              index: bookmarkInfo.storageIndex + 1,
            })
            break
          case ClipboardAction.Cut:
            await webExtension.bookmarks.move(clipboardState.items[0].id, {
              parentId: bookmarkInfo.parentId,
              index: bookmarkInfo.storageIndex + 1,
            })
            break
          default:
        }
        resetClipboard()
        break

      case MenuItem.SortByName:
        await sortBookmarksByName(bookmarkInfo.parentId)
        break

      default:
    }

    close()
  }, [
    bookmarkInfo,
    clipboardState,
    close,
    openEditor,
    resetClipboard,
    rowName,
    setClipboard,
    state,
  ])
}

const InnerMenuContainer = () => {
  const { close, state } = useMenuContext()

  const { state: clipboardState } = useClipboard()
  const unclickableRows =
    clipboardState.action !== ClipboardAction.None &&
    clipboardState.items.length > 0
      ? []
      : [MenuItem.Paste]

  const { searchQuery } = useBookmarkTrees()
  const isSearching = Boolean(searchQuery)
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
    <FloatingWindow
      positionLeft={state.displayPositions.left}
      positionTop={state.displayPositions.top}
      onClose={close}
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
  )
}

const MenuContainer = withProviders(InnerMenuContainer, [
  ListNavigationProvider,
])
export default MenuContainer
