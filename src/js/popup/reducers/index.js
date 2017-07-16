import {combineReducers} from 'redux'
import Immutable from 'seamless-immutable'

import {
  genDummyItemInfo,
  getBookmarkType,
  getSlicedTrees,
  isFolder
} from '../functions'
import * as CST from '../constants'

const rootReducer = combineReducers({
  copyTarget(
    state = null,
    action
  ) {
    switch (action.type) {
      case CST.UPDATE_COPY_TARGET:
        return action.payload

      case CST.UPDATE_CUT_TARGET:
        return null

      default:
        return state
    }
  },

  cutTarget(
    state = null,
    action
  ) {
    switch (action.type) {
      case CST.UPDATE_COPY_TARGET:
        return null

      case CST.UPDATE_CUT_TARGET:
        return action.payload

      default:
        return state
    }
  },

  dragIndicator(
    state = null,
    action
  ) {
    switch (action.type) {
      case CST.PUT_DRAG_INDICATOR: {
        const {
          isPlaceAfter,
          itemInfo
        } = action.payload

        let dragIndicatorIndex = 0
        switch (getBookmarkType(itemInfo)) {
          case CST.TYPE_BOOKMARK:
          case CST.TYPE_FOLDER:
          case CST.TYPE_SEPARATOR:
            dragIndicatorIndex = itemInfo.index + (isPlaceAfter ? 1 : 0)
            break

          default:
        }

        return Immutable({
          ...genDummyItemInfo(),
          id: CST.DRAG_INDICATOR,
          index: dragIndicatorIndex,
          parentId: itemInfo.parentId
        })
      }

      case CST.REMOVE_DRAG_INDICATOR:
        return null

      default:
        return state
    }
  },

  dragTarget(
    state = null,
    action
  ) {
    switch (action.type) {
      case CST.UPDATE_DRAG_TARGET:
        return action.payload

      default:
        return state
    }
  },

  editorTarget(
    state = null,
    action
  ) {
    switch (action.type) {
      case CST.UPDATE_EDITOR_TARGET:
        return action.payload

      default:
        return state
    }
  },

  focusTarget(
    state = null,
    action
  ) {
    switch (action.type) {
      case CST.REMOVE_FOCUS_TARGET_BY_ID:
        if (state && state.id === action.payload) {
          return null
        }
        return state

      case CST.UPDATE_FOCUS_TARGET:
        return action.payload

      default:
        return state
    }
  },

  isCreatingNewFolder(
    state = false,
    action
  ) {
    switch (action.type) {
      case CST.UPDATE_EDITOR_TARGET:
        if (action.payload === null) return false
        return state

      case CST.UPDATE_IS_CREATING_NEW_FOLDER:
        return action.payload

      default:
        return state
    }
  },

  itemOffsetHeight(
    state = 0
  ) {
    return state
  },

  menuPattern(
    state = [],
    action
  ) {
    switch (action.type) {
      case CST.UPDATE_MENU_TARGET: {
        const menuTarget = action.payload
        if (!menuTarget) return state

        const partialMenuPattern = [
          [CST.MENU_CUT, CST.MENU_COPY, CST.MENU_PASTE],
          [CST.MENU_ADD_PAGE, CST.MENU_ADD_FOLDER, CST.MENU_ADD_SEPARATOR],
          [CST.MENU_SORT_BY_NAME]
        ]

        if (isFolder(menuTarget)) {
          return Immutable([
            [CST.MENU_OPEN_ALL, CST.MENU_OPEN_ALL_IN_N, CST.MENU_OPEN_ALL_IN_I],
            [CST.MENU_RENAME, CST.MENU_DEL],
            ...partialMenuPattern
          ])
        }

        return Immutable([
          [CST.MENU_OPEN_IN_B, CST.MENU_OPEN_IN_N, CST.MENU_OPEN_IN_I],
          [CST.MENU_EDIT, CST.MENU_DEL],
          ...partialMenuPattern
        ])
      }

      default:
        return state
    }
  },

  menuTarget(
    state = null,
    action
  ) {
    switch (action.type) {
      case CST.UPDATE_MENU_TARGET:
        return action.payload

      default:
        return state
    }
  },

  mousePosition(
    state = Immutable({x: 0, y: 0}),
    action
  ) {
    switch (action.type) {
      case CST.UPDATE_MOUSE_POSITION:
        return action.payload

      default:
        return state
    }
  },

  options(
    state = Immutable({})
  ) {
    return state
  },

  rootTree(
    state = null
  ) {
    return state
  },

  searchKeyword(
    state = '',
    action
  ) {
    switch (action.type) {
      case CST.UPDATE_SEARCH_KEYWORD:
        return action.payload

      default:
        return state
    }
  },

  selectedMenuItem(
    state = null,
    action
  ) {
    switch (action.type) {
      case CST.UPDATE_MENU_TARGET: {
        const menuTarget = action.payload
        if (!menuTarget) return null

        return state
      }

      case CST.UPDATE_SELECTED_MENU_ITEM:
        return action.payload

      default:
        return state
    }
  },

  trees(
    state = Immutable([]),
    action
  ) {
    switch (action.type) {
      case CST.REMOVE_TREE_INFOS_FROM_INDEX:
        return getSlicedTrees(state, action.payload)

      case CST.REPLACE_TREE_INFO_BY_INDEX:
        return Immutable.set(
          state,
          action.payload.treeIndex,
          action.payload.treeInfo
        )

      case CST.UPDATE_TREES:
        return action.payload

      default:
        return state
    }
  }
})

export default rootReducer
