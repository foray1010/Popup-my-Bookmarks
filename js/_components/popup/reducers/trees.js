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
  REMOVE_TREE_INFOS_FROM_INDEX,
  REPLACE_TREE_INFO_BY_INDEX,
  UPDATE_TREES
} from '../constants/actionTypes'

function putDragIndicatorToTrees(state, action) {
  const {isPlaceAfter, itemInfo} = action

  const {parentId} = itemInfo

  const treesWithoutDragIndicator = removeDragIndicatorFromTrees(state)

  const treeIndex = treesWithoutDragIndicator.findIndex((treeInfo) => treeInfo.id === parentId)

  if (treeIndex >= 0) {
    const dragIndicatorInfo = {
      ...genDummyItemInfo(),
      id: DRAG_INDICATOR,
      parentId: parentId
    }
    const mutableTrees = treesWithoutDragIndicator.asMutable({deep: true})

    let placeInIndex = Math.max(itemInfo.index, 0)

    if (isPlaceAfter) placeInIndex += 1

    mutableTrees[treeIndex].children.splice(placeInIndex, 0, dragIndicatorInfo)

    return Immutable(mutableTrees)
  }

  return treesWithoutDragIndicator
}

function removeDragIndicatorFromTrees(state) {
  for (let treeIndex = state.length - 1; treeIndex >= 0; treeIndex -= 1) {
    const treeInfo = state[treeIndex]

    let isRemoved = false

    const newChildrenInfo = treeInfo.children.filter((itemInfo) => {
      const isDragIndicator = itemInfo.id === DRAG_INDICATOR

      if (isDragIndicator) isRemoved = true

      return !isDragIndicator
    })

    if (isRemoved) {
      const mutableTreeInfo = treeInfo.asMutable()
      const mutableTrees = state.asMutable()

      mutableTreeInfo.children = newChildrenInfo

      mutableTrees[treeIndex] = mutableTreeInfo

      return Immutable(mutableTrees)
    }
  }

  return state
}

export default function trees(state = Immutable([]), action) {
  switch (action.type) {
    case PUT_DRAG_INDICATOR:
      return putDragIndicatorToTrees(state, action)

    case REMOVE_DRAG_INDICATOR:
      return removeDragIndicatorFromTrees(state)

    case REMOVE_TREE_INFOS_FROM_INDEX:
      if (state.length > action.removeAfterIndex) {
        return state.slice(0, action.removeAfterIndex)
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
