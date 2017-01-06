import {connect} from 'react-redux'

import {
  dragEnd,
  dragOver,
  dragStart,
  hoverBookmarkItem,
  leftClickBookmarkItem,
  openMenu,
  updateFocusTarget
} from '../../../actions'
import BookmarkItem from './BookmarkItem'

const mapDispatchToProps = {
  dragEnd,
  dragOver,
  dragStart,
  hoverBookmarkItem,
  leftClickBookmarkItem,
  openMenu,
  updateFocusTarget
}

const mapStateToProps = (state, ownProps) => {
  const {
    cutTarget,
    dragTarget,
    focusTarget,
    menuTarget
  } = state
  const {itemInfo} = ownProps

  const isCutTarget = Boolean(cutTarget && cutTarget.id === itemInfo.id)
  const isDragTarget = Boolean(dragTarget && dragTarget.id === itemInfo.id)
  const isFocusTarget = Boolean(focusTarget && focusTarget.id === itemInfo.id)
  const isMenuTarget = Boolean(menuTarget && menuTarget.id === itemInfo.id)

  return {
    dragIndicator: state.dragIndicator,
    dragTarget: dragTarget,
    focusTarget: focusTarget,
    isSearching: Boolean(state.searchKeyword),
    isSelected: isDragTarget || isFocusTarget || isMenuTarget,
    isUnclickable: isCutTarget || isDragTarget,
    itemOffsetHeight: state.itemOffsetHeight,
    options: state.options,
    shouldKeepInView: isFocusTarget || isMenuTarget
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarkItem)
