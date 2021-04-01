import * as React from 'react'
import { useSelector } from 'react-redux'
import webExtension from 'webextension-polyfill'

import withProviders from '../../../core/utils/withProviders'
import { BOOKMARK_TYPES, MenuItem, OPEN_IN_TYPES } from '../../constants'
import { MENU_WINDOW } from '../../constants/windows'
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
import type { RootState } from '../../reduxs'
import type { BookmarkInfo } from '../../types'
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
import Mask from '../Mask'
import Menu from './Menu'
import { OpenState, useMenuContext } from './useMenu'
import { getMenuPattern } from './utils'

const menuConfig: Record<
  MenuItem,
  {
    useOnClick(opts: {
      bookmarkInfo: BookmarkInfo
      state: OpenState
    }): () => void
  }
> = {
  [MenuItem.AddFolder]: {
    useOnClick({ bookmarkInfo, state }) {
      const { open: openEditor } = useEditorContext()

      return React.useCallback(() => {
        openEditor({
          createAfterId: bookmarkInfo.id,
          isAllowedToEditUrl: false,
          isCreating: true,
          positions: state.targetPositions,
        })
      }, [bookmarkInfo, openEditor, state])
    },
  },
  [MenuItem.AddPage]: {
    useOnClick({ bookmarkInfo }) {
      return React.useCallback(async () => {
        await bookmarkCurrentPage({
          parentId: bookmarkInfo.parentId,
          index: bookmarkInfo.storageIndex + 1,
        })
      }, [bookmarkInfo])
    },
  },
  [MenuItem.AddSeparator]: {
    useOnClick({ bookmarkInfo }) {
      return React.useCallback(async () => {
        await createSeparator({
          parentId: bookmarkInfo.parentId,
          index: bookmarkInfo.storageIndex + 1,
        })
      }, [bookmarkInfo])
    },
  },
  [MenuItem.Copy]: {
    useOnClick({ bookmarkInfo }) {
      const { set: setClipboard } = useClipboard()

      return React.useCallback(() => {
        setClipboard({
          action: ClipboardAction.Copy,
          items: [{ id: bookmarkInfo.id }],
        })
      }, [bookmarkInfo, setClipboard])
    },
  },
  [MenuItem.Cut]: {
    useOnClick({ bookmarkInfo }) {
      const { set: setClipboard } = useClipboard()

      return React.useCallback(() => {
        setClipboard({
          action: ClipboardAction.Cut,
          items: [{ id: bookmarkInfo.id }],
        })
      }, [bookmarkInfo, setClipboard])
    },
  },
  [MenuItem.Delete]: {
    useOnClick({ bookmarkInfo }) {
      return React.useCallback(async () => {
        await webExtension.bookmarks.removeTree(bookmarkInfo.id)
      }, [bookmarkInfo])
    },
  },
  [MenuItem.Edit]: {
    useOnClick({ bookmarkInfo, state }) {
      const { open: openEditor } = useEditorContext()

      return React.useCallback(() => {
        openEditor({
          editTargetId: bookmarkInfo.id,
          isAllowedToEditUrl: bookmarkInfo.type !== BOOKMARK_TYPES.FOLDER,
          isCreating: false,
          positions: state.targetPositions,
        })
      }, [bookmarkInfo, openEditor, state])
    },
  },
  [MenuItem.OpenAll]: {
    useOnClick({ bookmarkInfo }) {
      return React.useCallback(async () => {
        await openFolderInBrowser(bookmarkInfo.id, {
          openIn: OPEN_IN_TYPES.BACKGROUND_TAB,
          isAllowBookmarklet: false,
          isCloseThisExtension: true,
        })
      }, [bookmarkInfo])
    },
  },
  [MenuItem.OpenAllInIncognitoWindow]: {
    useOnClick({ bookmarkInfo }) {
      return React.useCallback(async () => {
        await openFolderInBrowser(bookmarkInfo.id, {
          openIn: OPEN_IN_TYPES.INCOGNITO_WINDOW,
          isAllowBookmarklet: false,
          isCloseThisExtension: true,
        })
      }, [bookmarkInfo])
    },
  },
  [MenuItem.OpenAllInNewWindow]: {
    useOnClick({ bookmarkInfo }) {
      return React.useCallback(async () => {
        await openFolderInBrowser(bookmarkInfo.id, {
          openIn: OPEN_IN_TYPES.NEW_WINDOW,
          isAllowBookmarklet: false,
          isCloseThisExtension: true,
        })
      }, [bookmarkInfo])
    },
  },
  [MenuItem.OpenInBackgroundTab]: {
    useOnClick({ bookmarkInfo }) {
      return React.useCallback(async () => {
        await openBookmarksInBrowser([bookmarkInfo.id], {
          openIn: OPEN_IN_TYPES.BACKGROUND_TAB,
          isAllowBookmarklet: true,
          isCloseThisExtension: true,
        })
      }, [bookmarkInfo])
    },
  },
  [MenuItem.OpenInIncognitoWindow]: {
    useOnClick({ bookmarkInfo }) {
      return React.useCallback(async () => {
        await openBookmarksInBrowser([bookmarkInfo.id], {
          openIn: OPEN_IN_TYPES.INCOGNITO_WINDOW,
          isAllowBookmarklet: true,
          isCloseThisExtension: true,
        })
      }, [bookmarkInfo])
    },
  },
  [MenuItem.OpenInNewWindow]: {
    useOnClick({ bookmarkInfo }) {
      return React.useCallback(async () => {
        await openBookmarksInBrowser([bookmarkInfo.id], {
          openIn: OPEN_IN_TYPES.NEW_WINDOW,
          isAllowBookmarklet: true,
          isCloseThisExtension: true,
        })
      }, [bookmarkInfo])
    },
  },
  [MenuItem.Paste]: {
    useOnClick({ bookmarkInfo }) {
      const { reset: resetClipboard, state: clipboardState } = useClipboard()

      return React.useCallback(async () => {
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
      }, [bookmarkInfo, clipboardState, resetClipboard])
    },
  },
  [MenuItem.Rename]: {
    useOnClick({ bookmarkInfo, state }) {
      const { open: openEditor } = useEditorContext()

      return React.useCallback(() => {
        openEditor({
          editTargetId: bookmarkInfo.id,
          isAllowedToEditUrl: bookmarkInfo.type !== BOOKMARK_TYPES.FOLDER,
          isCreating: false,
          positions: state.targetPositions,
        })
      }, [bookmarkInfo, openEditor, state])
    },
  },
  [MenuItem.SortByName]: {
    useOnClick({ bookmarkInfo }) {
      return React.useCallback(async () => {
        await sortBookmarksByName(bookmarkInfo.parentId)
      }, [bookmarkInfo])
    },
  },
}

type Props = {
  close: () => void
  state: OpenState
}
function OpenMenuContainer({ close, state }: Props) {
  const isSearching = useSelector((state: RootState) =>
    Boolean(state.bookmark.searchKeyword),
  )

  const { state: clipboardState } = useClipboard()
  const unclickableRows =
    clipboardState.action !== ClipboardAction.None &&
    clipboardState.items.length > 0
      ? []
      : [MenuItem.Paste]

  const { data: bookmarkInfo } = useGetBookmarkInfo(state.targetId)
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

function InnerMenuContainer() {
  const { close, state } = useMenuContext()

  if (!state.isOpen) return null

  return <OpenMenuContainer close={close} state={state} />
}

const MenuContainer = withProviders(InnerMenuContainer, [
  ListNavigationProvider,
])
export default MenuContainer
