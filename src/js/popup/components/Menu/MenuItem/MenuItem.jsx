import {createElement, PureComponent} from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import {
  addCurrentPage,
  createBookmarkBelowTarget,
  openMultipleBookmarks,
  removeBookmark,
  sortByName
} from '../../../functions'
import * as CST from '../../../constants'

import '../../../../../css/popup/menu-item.css'

class MenuItem extends PureComponent {
  handleClick = (evt) => {
    evt.preventDefault()

    const {
      addFolder,
      closeMenu,
      isUnclickable,
      menuItemKey,
      menuTarget,
      options,
      pasteItem,
      updateCopyTarget,
      updateCutTarget,
      updateEditorTarget
    } = this.props

    if (isUnclickable) return

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
    const {menuItemKey, selectedMenuItem, updateSelectedMenuItem} = this.props

    if (selectedMenuItem !== menuItemKey) {
      updateSelectedMenuItem(menuItemKey)
    }
  }

  handleMouseLeave = () => {
    const {menuItemKey, selectedMenuItem, updateSelectedMenuItem} = this.props

    if (selectedMenuItem === menuItemKey) {
      updateSelectedMenuItem(null)
    }
  }

  render() {
    const {isSelected, isUnclickable, menuItemKey} = this.props

    const thisStyleName = classNames('main', {
      selected: isSelected,
      unclickable: isUnclickable
    })

    return (
      <div
        styleName={thisStyleName}
        id={menuItemKey}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {chrome.i18n.getMessage(menuItemKey)}
      </div>
    )
  }
}

MenuItem.propTypes = {
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

export default MenuItem
