import Immutable from 'seamless-immutable'

import {
  REMOVE_TREE_INFOS_FROM_INDEX,
  REPLACE_TREE_INFO_BY_INDEX,
  UPDATE_EDITOR_TARGET,
  UPDATE_MENU_TARGET,
  UPDATE_MOUSE_POSITION,
  UPDATE_SEARCH_KEYWORD,
  UPDATE_TREES
} from '../constants/actionTypes'

/* basic action */
export function removeTreeInfosFromIndex(removeFromIndex) {
  return Immutable({
    type: REMOVE_TREE_INFOS_FROM_INDEX,
    removeFromIndex: removeFromIndex
  })
}

export function replaceTreeInfoByIndex(treeIndex, treeInfo) {
  return Immutable({
    type: REPLACE_TREE_INFO_BY_INDEX,
    treeIndex: treeIndex,
    treeInfo: treeInfo
  })
}

export function updateEditorTarget(editorTarget) {
  return Immutable({
    type: UPDATE_EDITOR_TARGET,
    editorTarget: editorTarget
  })
}

export function updateMenuTarget(menuTarget) {
  return Immutable({
    type: UPDATE_MENU_TARGET,
    menuTarget: menuTarget
  })
}

export function updateMousePosition(mousePosition) {
  return Immutable({
    type: UPDATE_MOUSE_POSITION,
    mousePosition: mousePosition
  })
}

export function updateSearchKeyword(searchKeyword) {
  return Immutable({
    type: UPDATE_SEARCH_KEYWORD,
    searchKeyword: searchKeyword
  })
}

export function updateTrees(trees) {
  return Immutable({
    type: UPDATE_TREES,
    trees: trees
  })
}


/* advanced action */
