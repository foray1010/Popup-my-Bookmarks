import {connect} from 'react-redux'

import BookmarkTree from './BookmarkTree'

const mapStateToProps = (state, ownProps) => {
  const {
    options
  } = state

  const isSearching = Boolean(state.searchKeyword)

  return {
    dragIndicator: state.dragIndicator,
    isRememberLastPosition: options.rememberPos && !isSearching,
    isSearching,
    itemOffsetHeight: state.itemOffsetHeight,
    rootTree: state.rootTree,
    treeInfo: state.trees[ownProps.treeIndex]
  }
}

export default connect(
  mapStateToProps
)(BookmarkTree)
