/* @flow */

import {static as Immutable} from 'seamless-immutable'

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

/* basic action */
export function putDragIndicator(
  itemInfo: Object,
  isPlaceAfter: boolean
): Object {
  return Immutable({
    type: PUT_DRAG_INDICATOR,
    itemInfo: itemInfo,
    isPlaceAfter: isPlaceAfter
  })
}

export function removeDragIndicator(): Object {
  return Immutable({
    type: REMOVE_DRAG_INDICATOR
  })
}

export function removeTreeInfosFromIndex(removeFromIndex: number): Object {
  return Immutable({
    type: REMOVE_TREE_INFOS_FROM_INDEX,
    removeFromIndex: removeFromIndex
  })
}

export function replaceTreeInfoByIndex(
  treeIndex: number,
  treeInfo: Object
): Object {
  return Immutable({
    type: REPLACE_TREE_INFO_BY_INDEX,
    treeIndex: treeIndex,
    treeInfo: treeInfo
  })
}

export function updateCopyTarget(copyTarget: ?Object): Object {
  return Immutable({
    type: UPDATE_COPY_TARGET,
    copyTarget: copyTarget
  })
}

export function updateCutTarget(cutTarget: ?Object): Object {
  return Immutable({
    type: UPDATE_CUT_TARGET,
    cutTarget: cutTarget
  })
}

export function updateDragTarget(dragTarget: ?Object): Object {
  return Immutable({
    type: UPDATE_DRAG_TARGET,
    dragTarget: dragTarget
  })
}

export function updateEditorTarget(editorTarget: ?Object): Object {
  return Immutable({
    type: UPDATE_EDITOR_TARGET,
    editorTarget: editorTarget
  })
}

export function updateFocusTarget(focusTarget: ?Object): Object {
  return Immutable({
    type: UPDATE_FOCUS_TARGET,
    focusTarget: focusTarget
  })
}

export function updateIsCreatingNewFolder(isCreatingNewFolder: boolean): Object {
  return Immutable({
    type: UPDATE_IS_CREATING_NEW_FOLDER,
    isCreatingNewFolder: isCreatingNewFolder
  })
}

export function updateMenuTarget(menuTarget: ?Object): Object {
  return Immutable({
    type: UPDATE_MENU_TARGET,
    menuTarget: menuTarget
  })
}

export function updateMousePosition(mousePosition: Object): Object {
  return Immutable({
    type: UPDATE_MOUSE_POSITION,
    mousePosition: mousePosition
  })
}

export function updateSearchKeyword(searchKeyword: string): Object {
  return Immutable({
    type: UPDATE_SEARCH_KEYWORD,
    searchKeyword: searchKeyword
  })
}

export function updateTrees(trees: Object[]): Object {
  return Immutable({
    type: UPDATE_TREES,
    trees: trees
  })
}


/* advanced action */
