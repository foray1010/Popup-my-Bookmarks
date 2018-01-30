import PropTypes from 'prop-types'
import R from 'ramda'
import {connect} from 'react-redux'
import {createElement, PureComponent} from 'react'

import MenuItem from './MenuItem'
import * as actions from '../../../actions'
import * as CST from '../../../constants'
import {
  addCurrentPage,
  createBookmarkBelowTarget,
  getBookmarkType,
  openMultipleBookmarks,
  removeBookmark,
  sortByName
} from '../../../functions'

const mapDispatchToProps = R.pick(
  [
    'addFolder',
    'closeMenu',
    'pasteItem',
    'updateCopyTarget',
    'updateCutTarget',
    'updateEditorTarget',
    'updateSelectedMenuItem'
  ],
  actions
)

class MenuItemContainer extends PureComponent {
  static propTypes = {
    addFolder: PropTypes.func.isRequired,
    closeMenu: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
    isUnclickable: PropTypes.bool.isRequired,
    menuItemKey: PropTypes.string.isRequired,
    menuTarget: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    pasteItem: PropTypes.func.isRequired,
    selectedMenuItem: PropTypes.string,
    updateCopyTarget: PropTypes.func.isRequired,
    updateCutTarget: PropTypes.func.isRequired,
    updateEditorTarget: PropTypes.func.isRequired,
    updateSelectedMenuItem: PropTypes.func.isRequired
  }

  handleClick = (evt) => {
    evt.preventDefault()

    const {
      addFolder,
      closeMenu,
      menuItemKey,
      menuTarget,
      options,
      pasteItem,
      updateCopyTarget,
      updateCutTarget,
      updateEditorTarget
    } = this.props

    switch (menuItemKey) {
      case CST.MENU_OPEN_ALL:
      case CST.MENU_OPEN_IN_B:
        openMultipleBookmarks(menuTarget, {
          isWarnWhenOpenMany: options.warnOpenMany
        })
        break

      case CST.MENU_OPEN_ALL_IN_N:
      case CST.MENU_OPEN_IN_N:
        openMultipleBookmarks(menuTarget, {
          isNewWindow: true,
          isWarnWhenOpenMany: options.warnOpenMany
        })
        break

      case CST.MENU_OPEN_ALL_IN_I:
      case CST.MENU_OPEN_IN_I:
        openMultipleBookmarks(menuTarget, {
          isNewWindow: true,
          isIncognito: true,
          isWarnWhenOpenMany: options.warnOpenMany
        })
        break

      case CST.MENU_RENAME:
      case CST.MENU_EDIT:
        updateEditorTarget(menuTarget)
        break

      case CST.MENU_DEL:
        removeBookmark(menuTarget)
        break

      case CST.MENU_CUT:
        updateCutTarget(menuTarget)
        break

      case CST.MENU_COPY:
        updateCopyTarget(menuTarget)
        break

      case CST.MENU_PASTE:
        pasteItem()
        break

      case CST.MENU_ADD_PAGE:
        addCurrentPage(menuTarget)
        break

      case CST.MENU_ADD_FOLDER:
        addFolder(menuTarget)
        break

      case CST.MENU_ADD_SEPARATOR:
        createBookmarkBelowTarget(menuTarget, '- '.repeat(42), CST.SEPARATE_THIS_URL)
        break

      case CST.MENU_SORT_BY_NAME:
        sortByName(menuTarget.parentId)
        break

      default:
    }

    closeMenu()
  }

  handleMouseEnter = () => {
    if (this.props.selectedMenuItem !== this.props.menuItemKey) {
      this.props.updateSelectedMenuItem(this.props.menuItemKey)
    }
  }

  handleMouseLeave = () => {
    if (this.props.selectedMenuItem === this.props.menuItemKey) {
      this.props.updateSelectedMenuItem(null)
    }
  }

  render = () => (
    <MenuItem
      {...this.props}
      onClick={this.props.isUnclickable ? null : this.handleClick}
      onMouseEnter={this.handleMouseEnter}
      onMouseLeave={this.handleMouseLeave}
    />
  )
}

const mapStateToProps = (state, ownProps) => {
  const {
    copyTarget, cutTarget, menuTarget, selectedMenuItem
  } = state
  const {menuItemKey} = ownProps

  const isUnclickable = (() => {
    if (!menuTarget) return true

    switch (menuItemKey) {
      case 'copy':
      case 'cut':
        return getBookmarkType(menuTarget) === CST.TYPE_NO_BOOKMARK

      case 'paste':
        return !copyTarget && !cutTarget

      default:
    }

    return false
  })()

  return {
    copyTarget,
    cutTarget,
    isSelected: selectedMenuItem === menuItemKey,
    isUnclickable,
    menuTarget,
    options: state.options,
    selectedMenuItem
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemContainer)
