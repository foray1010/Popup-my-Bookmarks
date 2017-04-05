import {connect} from 'react-redux'

import BookmarkTree from './BookmarkTree'

const mapStateToProps = (state, ownProps) => {
  const {
    dragIndicator,
    focusTarget,
    itemOffsetHeight,
    options,
    rootTree
  } = state

  const isSearching = Boolean(state.searchKeyword)
  const treeInfo = state.trees[ownProps.treeIndex]

  let scrollToIndex = -1
  if (focusTarget) {
    let compiledChildrenInfo = treeInfo.children

    const isFirstTree = ownProps.treeIndex === 0
    if (isFirstTree && !isSearching) {
      compiledChildrenInfo = rootTree.children.concat(compiledChildrenInfo)
    }

    scrollToIndex = compiledChildrenInfo.findIndex((itemInfo) => itemInfo.id === focusTarget.id)
  }

  return {
    dragIndicator,
    isRememberLastPosition: options.rememberPos && !isSearching,
    isSearching,
    itemOffsetHeight,
    rootTree,
    scrollToIndex,
    treeInfo
  }
}

export default connect(
  mapStateToProps
)(BookmarkTree)
