import {connect} from 'react-redux'

import MenuItem from './MenuItem'
import {
  addFolder,
  closeMenu,
  pasteItem,
  updateCopyTarget,
  updateCutTarget,
  updateEditorTarget,
  updateSelectedMenuItem
} from '../../../actions'
import {getBookmarkType} from '../../../functions'
import {TYPE_NO_BOOKMARK} from '../../../constants'

const mapDispatchToProps = {
  addFolder,
  closeMenu,
  pasteItem,
  updateCopyTarget,
  updateCutTarget,
  updateEditorTarget,
  updateSelectedMenuItem
}

const mapStateToProps = (state, ownProps) => {
  const {copyTarget, cutTarget, menuTarget, selectedMenuItem} = state
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
    isSelected: selectedMenuItem === menuItemKey,
    isUnclickable: isUnclickable,
    menuTarget: menuTarget,
    options: state.options,
    selectedMenuItem: selectedMenuItem
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuItem)
