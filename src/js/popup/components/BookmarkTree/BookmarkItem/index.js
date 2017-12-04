import {connect} from 'react-redux'

import BookmarkItem from './BookmarkItem'
import {
  closeEditor,
  closeMenu,
  dragEnd,
  dragOver,
  dragStart,
  hoverBookmarkItem,
  leftClickBookmarkItem,
  openMenu,
  removeFocusTargetById,
  updateFocusTarget
} from '../../../actions'

const mapDispatchToProps = {
  closeEditor,
  closeMenu,
  dragEnd,
  dragOver,
  dragStart,
  hoverBookmarkItem,
  leftClickBookmarkItem,
  openMenu,
  removeFocusTargetById,
  updateFocusTarget
}

const mapStateToProps = (state, ownProps) => {
  const {
    cutTarget, dragTarget, editorTarget, focusTarget, menuTarget
  } = state
  const {itemInfo} = ownProps

  const isCutTarget = Boolean(cutTarget && cutTarget.id === itemInfo.id)
  const isDragTarget = Boolean(dragTarget && dragTarget.id === itemInfo.id)
  const isEditorTarget = Boolean(editorTarget && editorTarget.id === itemInfo.id)
  const isFocusTarget = Boolean(focusTarget && focusTarget.id === itemInfo.id)
  const isMenuTarget = Boolean(menuTarget && menuTarget.id === itemInfo.id)

  return {
    dragIndicator: state.dragIndicator,
    dragTarget,
    isEditorTarget,
    isMenuTarget,
    isSearching: Boolean(state.searchKeyword),
    isSelected: isDragTarget || isEditorTarget || isFocusTarget || isMenuTarget,
    isUnclickable: isCutTarget || isDragTarget,
    options: state.options
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkItem)
