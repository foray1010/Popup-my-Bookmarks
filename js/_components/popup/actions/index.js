import Immutable from 'seamless-immutable'

/* action type */
export const REMOVE_TREE_INFOS_FROM_INDEX = 'REMOVE_TREE_INFOS_FROM_INDEX'
export const REPLACE_TREE_INFO_BY_INDEX = 'REPLACE_TREE_INFO_BY_INDEX'
export const UPDATE_EDITOR_TARGET = 'UPDATE_EDITOR_TARGET'
export const UPDATE_MENU_TARGET = 'UPDATE_MENU_TARGET'
export const UPDATE_MOUSE_POSITION = 'UPDATE_MOUSE_POSITION'
export const UPDATE_SEARCH_KEYWORD = 'UPDATE_SEARCH_KEYWORD'
export const UPDATE_TREES = 'UPDATE_TREES'


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
