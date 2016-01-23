import {combineReducers} from 'redux'
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

const rootReducer = combineReducers({
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

  trees(state = Immutable([]), action) {
    switch (action.type) {
      case REMOVE_TREE_INFOS_FROM_INDEX:
        if (state.length > action.removeFromIndex) {
          return state.slice(0, action.removeFromIndex)
        }

        return state

      case REPLACE_TREE_INFO_BY_INDEX:
        const mutableTrees = state.asMutable()

        mutableTrees[action.treeIndex] = action.treeInfo

        return Immutable(mutableTrees)

      case UPDATE_TREES:
        return action.trees

      default:
        return state
    }
  }
})

export default rootReducer
