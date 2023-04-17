import * as React from 'react'
import webExtension from 'webextension-polyfill'

import isMac from '../../../core/utils/isMac.js'
import withProviders from '../../../core/utils/withProviders.js'
import { OPEN_IN_TYPES } from '../../constants/menu.js'
import { WindowId } from '../../constants/windows.js'
import { BOOKMARK_TYPES } from '../../modules/bookmarks/constants.js'
import { useBookmarkTreesContext } from '../../modules/bookmarks/contexts/bookmarkTrees.js'
import useGetBookmarkInfo from '../../modules/bookmarks/hooks/useGetBookmarkInfo.js'
import { recursiveCopyBookmarks } from '../../modules/bookmarks/methods/copyBookmark.js'
import {
  bookmarkCurrentPage,
  createSeparator,
} from '../../modules/bookmarks/methods/createBookmark.js'
import {
  openBookmarksInBrowser,
  openFolderInBrowser,
} from '../../modules/bookmarks/methods/openBookmark.js'
import sortBookmarksByName from '../../modules/bookmarks/methods/sortBookmarksByName.js'
import {
  ClipboardAction,
  useClipboardContext,
} from '../../modules/clipboard.js'
import { useEditorContext } from '../editor/index.js'
import { FloatingWindow } from '../floatingWindow/index.js'
import { KeyBindingsWindow, useKeyBindingsEvent } from '../keyBindings/index.js'
import {
  ListNavigationProvider,
  useKeyboardNav,
  useListNavigationContext,
} from '../listNavigation/index.js'
import { MenuItem } from './constants.js'
import Menu from './Menu.js'
import { useMenuContext } from './useMenu.js'
import { getMenuPattern } from './utils.js'

function useClickMenuRow(rowName?: MenuItem) {
  const { close, state } = useMenuContext()
  const { open: openEditor } = useEditorContext()

  const {
    reset: resetClipboard,
    set: setClipboard,
    state: clipboardState,
  } = useClipboardContext()

  const { data: bookmarkInfo } = useGetBookmarkInfo(
    state.isOpen ? state.targetId : undefined,
  )

  return React.useCallback(async () => {
    if (!rowName || !state.isOpen || !bookmarkInfo) return

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
          items: new Set([bookmarkInfo.id]),
        })
        break

      case MenuItem.Cut:
        setClipboard({
          action: ClipboardAction.Cut,
          items: new Set([bookmarkInfo.id]),
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
            for (const id of clipboardState.items.values()) {
              await recursiveCopyBookmarks(id, {
                parentId: bookmarkInfo.parentId,
                index: bookmarkInfo.storageIndex + 1,
              })
            }
            break

          case ClipboardAction.Cut:
            for (const id of clipboardState.items.values()) {
              await webExtension.bookmarks.move(id, {
                parentId: bookmarkInfo.parentId,
                index: bookmarkInfo.storageIndex + 1,
              })
            }
            break

          case ClipboardAction.None:
            break
        }
        resetClipboard()
        break

      case MenuItem.SortByName:
        if (bookmarkInfo.parentId) {
          await sortBookmarksByName(bookmarkInfo.parentId)
        }
        break
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

function InnerMenuContainer() {
  const { close, state } = useMenuContext()

  const { state: clipboardState } = useClipboardContext()
  const unclickableRows =
    clipboardState.action !== ClipboardAction.None &&
    clipboardState.items.size > 0
      ? []
      : [MenuItem.Paste]

  const { searchQuery } = useBookmarkTreesContext()
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

  useKeyboardNav({ windowId: WindowId.Menu })

  const handleRowClick = useClickMenuRow(
    highlightedIndex !== undefined ? allRowNames[highlightedIndex] : undefined,
  )

  useKeyBindingsEvent({ key: 'Enter', windowId: WindowId.Menu }, handleRowClick)
  useKeyBindingsEvent(
    { key: isMac() ? 'Control' : 'ContextMenu', windowId: WindowId.Menu },
    close,
  )

  if (!state.isOpen) return null
  // Without this condition, it will cause content jumping after menu pattern is fetched
  if (menuPattern.length === 0) return null

  return (
    <FloatingWindow
      positionLeft={state.displayPositions.left}
      positionTop={state.displayPositions.top}
      onClose={close}
    >
      <KeyBindingsWindow windowId={WindowId.Menu}>
        <Menu
          highlightedIndex={highlightedIndex}
          menuPattern={menuPattern}
          unclickableRows={unclickableRows}
          onRowClick={handleRowClick}
          onRowMouseEnter={(index: number) => () => {
            setHighlightedIndex(0, index)
          }}
          onRowMouseLeave={(index: number) => () => {
            unsetHighlightedIndex(0, index)
          }}
        />
      </KeyBindingsWindow>
    </FloatingWindow>
  )
}

const MenuContainer = withProviders(InnerMenuContainer, [
  ListNavigationProvider,
])
export default MenuContainer
