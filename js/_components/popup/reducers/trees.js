import Immutable from 'seamless-immutable'

import {
  getSlicedTrees
} from '../functions'
import {
  REMOVE_TREE_INFOS_FROM_INDEX,
  REPLACE_TREE_INFO_BY_INDEX,
  UPDATE_TREES
} from '../constants/actionTypes'

export default function trees(state = Immutable([]), action) {
  switch (action.type) {
    case REMOVE_TREE_INFOS_FROM_INDEX:
      return getSlicedTrees(state, action.removeFromIndex)

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
