import {connect} from 'react-redux'

import {
  addFolder,
  closeMenu,
  pasteItem,
  updateCopyTarget,
  updateCutTarget,
  updateEditorTarget
} from '../../actions'
import {
  getBookmarkType
} from '../../functions'
import {
  TYPE_NO_BOOKMARK
} from '../../constants'
import MenuItem from './MenuItem'

const mapDispatchToProps = {
  addFolder,
  closeMenu,
  pasteItem,
  updateCopyTarget,
  updateCutTarget,
  updateEditorTarget
}

const mapStateToProps = (state, ownProps) => {
  const {
    copyTarget,
    cutTarget,
    menuTarget
  } = state
  const {menuItemKey} = ownProps

  const isUnclickable = (() => {
    if (!menuTarget) return true

    switch (menuItemKey) {
      case 'copy':
      case 'cut':
        return getBookmarkType(menuTarget) === TYPE_NO_BOOKMARK

      case 'paste':
        return !copyTarget && !cutTarget

      default:
    }

    return false
  })()

  return {
    copyTarget: copyTarget,
    cutTarget: cutTarget,
    isUnclickable: isUnclickable,
    menuTarget: menuTarget,
    options: state.options
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuItem)
