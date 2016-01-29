import {combineReducers} from 'redux'
import Immutable from 'seamless-immutable'

import {
  DRAG_INDICATOR
} from '../constants'
import {
  genDummyItemInfo
} from '../functions'
import {
  PUT_DRAG_INDICATOR,
  REMOVE_DRAG_INDICATOR,
  UPDATE_COPY_TARGET,
  UPDATE_CUT_TARGET,
  UPDATE_DRAG_TARGET,
  UPDATE_EDITOR_TARGET,
  UPDATE_MENU_TARGET,
  UPDATE_MOUSE_POSITION,
  UPDATE_SEARCH_KEYWORD
} from '../constants/actionTypes'
import trees from './trees'

const rootReducer = combineReducers({
  copyTarget(state = null, action) {
    switch (action.type) {
      case UPDATE_COPY_TARGET:
        return action.copyTarget

      case UPDATE_CUT_TARGET:
        return null

      default:
        return state
    }
  },

  cutTarget(state = null, action) {
    switch (action.type) {
      case UPDATE_COPY_TARGET:
        return null

      case UPDATE_CUT_TARGET:
        return action.cutTarget

      default:
        return state
    }
  },

  dragIndicator(state = null, action) {
    switch (action.type) {
      case PUT_DRAG_INDICATOR:
        const {isPlaceAfter, itemInfo} = action

        return {
          ...genDummyItemInfo(),
          id: DRAG_INDICATOR,
          index: Math.max(itemInfo.index, 0) + (isPlaceAfter ? 1 : 0),
          parentId: itemInfo.parentId
        }

      case REMOVE_DRAG_INDICATOR:
        return null

      default:
        return state
    }
  },

  dragTarget(state = null, action) {
    switch (action.type) {
      case UPDATE_DRAG_TARGET:
        return action.dragTarget

      default:
        return state
    }
  },

  editorTarget(state = null, action) {
    switch (action.type) {
      case UPDATE_EDITOR_TARGET:
        return action.editorTarget

      default:
        return state
    }
  },

  itemOffsetHeight(state = 0) {
    return state
  },

  menuTarget(state = null, action) {
    switch (action.type) {
      case UPDATE_MENU_TARGET:
        return action.menuTarget

      default:
        return state
    }
  },

  mousePosition(state = Immutable({x: 0, y: 0}), action) {
    switch (action.type) {
      case UPDATE_MOUSE_POSITION:
        return action.mousePosition

      default:
        return state
    }
  },

  options(state = Immutable({})) {
    return state
  },

  rootTree(state = Immutable({})) {
    return state
  },

  searchKeyword(state = '', action) {
    switch (action.type) {
      case UPDATE_SEARCH_KEYWORD:
        return action.searchKeyword

      default:
        return state
    }
  },

  trees
})

export default rootReducer
