/* @flow */

import {static as Immutable} from 'seamless-immutable'

import {
  createAction
} from '../../common/functions'
import {
  genBookmarkList,
  getBookmark,
  getBookmarkType,
  getFlatTree,
  getFocusTargetTreeIndex,
  getSearchResult,
  isFolder,
  isFolderOpened,
  pasteItemBelowTarget,
  initTrees
} from '../functions'
import * as CST from '../constants'

export const putDragIndicator = createAction(
  CST.PUT_DRAG_INDICATOR,
  (
    itemInfo: Object,
    isPlaceAfter: boolean
  ): Object => ({
    itemInfo,
    isPlaceAfter
  })
)

export const removeDragIndicator = createAction(
  CST.REMOVE_DRAG_INDICATOR
)

export const removeTreeInfosFromIndex = createAction(
  CST.REMOVE_TREE_INFOS_FROM_INDEX,
  (removeFromIndex: number): number => removeFromIndex
)

export const replaceTreeInfoByIndex = createAction(
  CST.REPLACE_TREE_INFO_BY_INDEX,
  (
    treeIndex: number,
    treeInfo: Object
  ): Object => ({
    treeIndex,
    treeInfo
  })
)

export const updateCopyTarget = createAction(
  CST.UPDATE_COPY_TARGET,
  (copyTarget: ?Object): ?Object => copyTarget
)

export const updateCutTarget = createAction(
  CST.UPDATE_CUT_TARGET,
  (cutTarget: ?Object): ?Object => cutTarget
)

export const updateDragTarget = createAction(
  CST.UPDATE_DRAG_TARGET,
  (dragTarget: ?Object): ?Object => dragTarget
)

export const updateEditorTarget = createAction(
  CST.UPDATE_EDITOR_TARGET,
  (editorTarget: ?Object): ?Object => editorTarget
)

export const updateFocusTarget = createAction(
  CST.UPDATE_FOCUS_TARGET,
  (focusTarget: ?Object): ?Object => focusTarget
)

export const updateIsCreatingNewFolder = createAction(
  CST.UPDATE_IS_CREATING_NEW_FOLDER,
  (isCreatingNewFolder: boolean): boolean => isCreatingNewFolder
)

export const updateMenuTarget = createAction(
  CST.UPDATE_MENU_TARGET,
  (menuTarget: ?Object): ?Object => menuTarget
)

export const updateMousePosition = createAction(
  CST.UPDATE_MOUSE_POSITION,
  (mousePosition: Object): Object => mousePosition
)

export const updateSearchKeyword = createAction(
  CST.UPDATE_SEARCH_KEYWORD,
  (searchKeyword: string): string => searchKeyword
)

export const updateTrees = createAction(
  CST.UPDATE_TREES,
  (trees: Object[]): Object[] => trees
)


/**
 * Following functions are predefined actions
 */

export const addFolder = (belowTarget: Object): Object[] => {
  return [
    updateEditorTarget(belowTarget),
    updateIsCreatingNewFolder(true)
  ]
}

export const closeEditor = (): Object => updateEditorTarget(null)

export const closeMenu = (): Object => updateMenuTarget(null)

export const closeMenuCover = (): Object[] => {
  return [
    closeEditor(),
    closeMenu()
  ]
}

export const dragEnd = (): Object[] => ([
  removeDragIndicator(),
  updateDragTarget(null)
])

export const dragStart = (
  itemInfo: Object,
  currentTreeIndex: number
): Object[] => ([
  removeTreeInfosFromIndex(currentTreeIndex + 1),
  updateDragTarget(itemInfo)
])


/**
 * Following functions have side effect
 */

export const dragOver = (
  itemInfo: Object,
  currentTreeIndex: number,
  isPlaceAfter: boolean
) => {
  return (
    dispatch: Function,
    getState: Function
  ): void => {
    const {
      dragTarget
    } = getState()

    const actionList = []

    const isDragTarget = dragTarget.id === itemInfo.id

    const shouldRemoveDragIndicator: boolean = (() => {
      const isSiblingOfDragTarget = (
        dragTarget.parentId === itemInfo.parentId &&
        Math.abs(dragTarget.index - itemInfo.index) === 1
      )

      if (isSiblingOfDragTarget) {
        const isDragTargetAfterItemInfo = dragTarget.index - itemInfo.index > 0

        if (isPlaceAfter) {
          return isDragTargetAfterItemInfo
        } else {
          return !isDragTargetAfterItemInfo
        }
      }

      return (
        isDragTarget ||
        getBookmarkType(itemInfo) === CST.TYPE_ROOT_FOLDER
      )
    })()

    // item cannot be the parent folder of itself
    if (!isDragTarget && isFolder(itemInfo)) {
      actionList.push(openFolder(itemInfo, currentTreeIndex + 1))
    } else {
      actionList.push(removeTreeInfosFromIndex(currentTreeIndex + 1))
    }

    if (shouldRemoveDragIndicator) {
      actionList.push(removeDragIndicator())
    } else {
      actionList.push(putDragIndicator(itemInfo, isPlaceAfter))
    }

    dispatch(actionList)
  }
}

export const hoverBookmarkItem = (
  itemInfo: Object,
  targetTreeIndex: number
) => {
  return (
    dispatch: Function,
    getState: Function
  ): void => {
    const {
      options,
      trees
    } = getState()

    if (!options.opFolderBy) {
      if (isFolder(itemInfo)) {
        if (!isFolderOpened(trees, itemInfo)) {
          dispatch(
            openFolder(itemInfo, targetTreeIndex)
          )
        }
      } else {
        dispatch(
          removeTreeInfosFromIndex(targetTreeIndex)
        )
      }
    }
  }
}

export const leftClickBookmarkItem = (
  itemInfo: Object,
  targetTreeIndex: number
) => {
  return (
    dispatch: Function,
    getState: Function
  ): void => {
    const {
      options,
      trees
    } = getState()

    if (options.opFolderBy) {
      if (!isFolderOpened(trees, itemInfo)) {
        dispatch(
          openFolder(itemInfo, targetTreeIndex)
        )
      } else {
        dispatch(
          removeTreeInfosFromIndex(targetTreeIndex)
        )
      }
    }
  }
}

export const onPressArrowKey = (
  arrowDirection: 'down' | 'left' | 'right' | 'up'
) => {
  return async (
    dispatch: Function,
    getState: Function
  ): Promise<void> => {
    const {
      focusTarget,
      rootTree,
      searchKeyword,
      trees
    } = getState()

    const targetTreeIndex = getFocusTargetTreeIndex(focusTarget, trees)

    switch (arrowDirection) {
      case 'down':
      case 'up': {
        const isUp = arrowDirection === 'up'

        const targetBookmarkList = genBookmarkList(trees[targetTreeIndex], {
          isSearching: Boolean(searchKeyword),
          rootTree,
          treeIndex: targetTreeIndex
        })

        const lastItemIndex = targetBookmarkList.length - 1

        let nextSelectedIndex
        if (focusTarget) {
          const origSelectedIndex = targetBookmarkList
            .findIndex((itemInfo) => itemInfo.id === focusTarget.id)

          if (isUp) {
            nextSelectedIndex = origSelectedIndex - 1
            if (nextSelectedIndex < 0) {
              nextSelectedIndex = lastItemIndex
            }
          } else {
            nextSelectedIndex = origSelectedIndex + 1
            if (nextSelectedIndex > lastItemIndex) {
              nextSelectedIndex = 0
            }
          }
        } else {
          nextSelectedIndex = isUp ? lastItemIndex : 0
        }

        dispatch(updateFocusTarget(targetBookmarkList[nextSelectedIndex]))
        break
      }

      case 'left':
        // at least we need one tree
        if (trees.length > 1) {
          const targetTree = trees[targetTreeIndex]

          const targetTreeItemInfo = await getBookmark(targetTree.id)

          dispatch([
            removeTreeInfosFromIndex(targetTreeIndex),
            updateFocusTarget(targetTreeItemInfo)
          ])
        }
        break

      case 'right':
        if (focusTarget && isFolder(focusTarget)) {
          const nextTreeIndex = targetTreeIndex + 1
          const nextTreeInfo = await getFlatTree(focusTarget.id)

          const nextBookmarkList = genBookmarkList(nextTreeInfo, {
            isSearching: Boolean(searchKeyword),
            rootTree,
            treeIndex: nextTreeIndex
          })

          dispatch([
            replaceTreeInfoByIndex(nextTreeIndex, nextTreeInfo),
            updateFocusTarget(nextBookmarkList[0])
          ])
        }
        break

      default:
    }
  }
}

const openFolder = (
  itemInfo: Object,
  targetTreeIndex: number
) => {
  return async (
    dispatch: Function
  ): Promise<void> => {
    const treeInfo = await getFlatTree(itemInfo.id)

    dispatch(
      replaceTreeInfoByIndex(targetTreeIndex, treeInfo)
    )
  }
}

export const openMenu = (
  menuTarget: Object,
  mousePosition: ?{x: number, y: number}
) => {
  return (
    dispatch: Function
  ): void => {
    const actions = []

    if (mousePosition) {
      actions.push(
        updateMousePosition(mousePosition)
      )
    } else {
      const el = document.getElementById(menuTarget.id)
      if (el) {
        const elOffset = el.getBoundingClientRect()

        actions.push(
          updateMousePosition({
            x: elOffset.left,
            y: elOffset.top
          })
        )
      }
    }

    dispatch([
      ...actions,
      updateMenuTarget(menuTarget)
    ])
  }
}

export const pasteItem = () => {
  return async (
    dispatch: Function,
    getState: Function
  ): Promise<void> => {
    const {
      copyTarget,
      cutTarget,
      menuTarget
    } = getState()

    const isCut = Boolean(cutTarget)

    const fromTarget = isCut ? cutTarget : copyTarget

    await pasteItemBelowTarget(fromTarget, menuTarget, isCut)

    if (isCut) {
      dispatch(updateCutTarget(null))
    }
  }
}

export const renewTrees = (oldTrees: Object[]) => {
  return async (
    dispatch: Function,
    getState: Function
  ): Promise<void> => {
    const {
      options,
      searchKeyword
    } = getState()

    const newTrees = await Promise.all(
      // Promise.all doesn't accept immutable array
      Immutable.asMutable(oldTrees).map((treeInfo) => {
        if (treeInfo.id === 'search-result') {
          return getSearchResult(searchKeyword, options)
        }

        return getFlatTree(treeInfo.id)
      })
    )

    dispatch([
      // to make sure the menu and editor is not activated when bookmark is updating
      closeMenuCover(),

      updateTrees(newTrees)
    ])
  }
}

export const updateTreesBySearchKeyword = (newSearchKeyword: string) => {
  return async (
    dispatch: Function,
    getState: Function
  ): Promise<void> => {
    const {
      options
    } = getState()

    let newTrees
    if (newSearchKeyword === '') {
      newTrees = await initTrees(options)
    } else {
      const searchResult = await getSearchResult(newSearchKeyword, options)

      newTrees = [searchResult]
    }

    dispatch([
      updateSearchKeyword(newSearchKeyword),
      updateTrees(newTrees)
    ])
  }
}
