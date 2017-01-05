/* @flow */

import {
  createAction
} from '../../common/functions'
import {
  pasteItemBelowTarget
} from '../functions'
import {
  PUT_DRAG_INDICATOR,
  REMOVE_DRAG_INDICATOR,
  REMOVE_TREE_INFOS_FROM_INDEX,
  REPLACE_TREE_INFO_BY_INDEX,
  UPDATE_COPY_TARGET,
  UPDATE_CUT_TARGET,
  UPDATE_DRAG_TARGET,
  UPDATE_EDITOR_TARGET,
  UPDATE_FOCUS_TARGET,
  UPDATE_IS_CREATING_NEW_FOLDER,
  UPDATE_MENU_TARGET,
  UPDATE_MOUSE_POSITION,
  UPDATE_SEARCH_KEYWORD,
  UPDATE_TREES
} from '../constants'

export const putDragIndicator = createAction(
  PUT_DRAG_INDICATOR,
  (
    itemInfo: Object,
    isPlaceAfter: boolean
  ): Object => ({
    itemInfo,
    isPlaceAfter
  })
)

export const removeDragIndicator = createAction(
  REMOVE_DRAG_INDICATOR
)

export const removeTreeInfosFromIndex = createAction(
  REMOVE_TREE_INFOS_FROM_INDEX,
  (removeFromIndex: number): number => removeFromIndex
)

export const replaceTreeInfoByIndex = createAction(
  REPLACE_TREE_INFO_BY_INDEX,
  (
    treeIndex: number,
    treeInfo: Object
  ): Object => ({
    treeIndex,
    treeInfo
  })
)

export const updateCopyTarget = createAction(
  UPDATE_COPY_TARGET,
  (copyTarget: ?Object): ?Object => copyTarget
)

export const updateCutTarget = createAction(
  UPDATE_CUT_TARGET,
  (cutTarget: ?Object): ?Object => cutTarget
)

export const updateDragTarget = createAction(
  UPDATE_DRAG_TARGET,
  (dragTarget: ?Object): ?Object => dragTarget
)

export const updateEditorTarget = createAction(
  UPDATE_EDITOR_TARGET,
  (editorTarget: ?Object): ?Object => editorTarget
)

export const updateFocusTarget = createAction(
  UPDATE_FOCUS_TARGET,
  (focusTarget: ?Object): ?Object => focusTarget
)

export const updateIsCreatingNewFolder = createAction(
  UPDATE_IS_CREATING_NEW_FOLDER,
  (isCreatingNewFolder: boolean): boolean => isCreatingNewFolder
)

export const updateMenuTarget = createAction(
  UPDATE_MENU_TARGET,
  (menuTarget: ?Object): ?Object => menuTarget
)

export const updateMousePosition = createAction(
  UPDATE_MOUSE_POSITION,
  (mousePosition: Object): Object => mousePosition
)

export const updateSearchKeyword = createAction(
  UPDATE_SEARCH_KEYWORD,
  (searchKeyword: string): string => searchKeyword
)

export const updateTrees = createAction(
  UPDATE_TREES,
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


/**
 * Following functions have side effect
 */

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
