import {autobind} from 'core-decorators'
import {createElement, PropTypes, PureComponent} from 'react'
import classNames from 'classnames'
import CSSModules from 'react-css-modules'

import {
  addCurrentPage,
  createBookmarkBelowTarget,
  openMultipleBookmarks,
  removeBookmark,
  sortByName
} from '../../functions'
import {
  SEPARATE_THIS_URL
} from '../../constants'

import styles from '../../../../css/popup/menu-item.css'

class MenuItem extends PureComponent {
  @autobind
  async handleClick(evt) {
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
      case 'openAll':
      case 'openInB':
        await openMultipleBookmarks(menuTarget, {
          isWarnWhenOpenMany: options.warnOpenMany
        })
        break

      case 'openAllInN':
      case 'openInN':
        await openMultipleBookmarks(menuTarget, {
          isNewWindow: true,
          isWarnWhenOpenMany: options.warnOpenMany
        })
        break

      case 'openAllInI':
      case 'openInI':
        await openMultipleBookmarks(menuTarget, {
          isNewWindow: true,
          isIncognito: true,
          isWarnWhenOpenMany: options.warnOpenMany
        })
        break

      case 'rename':
      case 'edit':
        updateEditorTarget(menuTarget)
        break

      case 'del':
        await removeBookmark(menuTarget)
        break

      case 'cut':
        updateCutTarget(menuTarget)
        break

      case 'copy':
        updateCopyTarget(menuTarget)
        break

      case 'paste':
        await pasteItem()
        break

      case 'addPage':
        await addCurrentPage(menuTarget)
        break

      case 'addFolder':
        addFolder(menuTarget)
        break

      case 'addSeparator':
        await createBookmarkBelowTarget(
          menuTarget,
          '- '.repeat(42),
          SEPARATE_THIS_URL
        )
        break

      case 'sortByName':
        await sortByName(menuTarget.parentId)
        break

      default:
    }

    closeMenu()
  }

  render() {
    const {
      isUnclickable,
      menuItemKey
    } = this.props

    const thisStyleName = classNames(
      'main',
      {
        unclickable: isUnclickable
      }
    )

    return (
      <li>
        <div
          styleName={thisStyleName}
          tabIndex={isUnclickable ? -1 : null} // not accessible by Tab
          onClick={this.handleClick}
        >
          {chrome.i18n.getMessage(menuItemKey)}
        </div>
      </li>
    )
  }
}

MenuItem.propTypes = {
  addFolder: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
  isUnclickable: PropTypes.bool.isRequired,
  menuItemKey: PropTypes.string.isRequired,
  menuTarget: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  pasteItem: PropTypes.func.isRequired,
  updateCopyTarget: PropTypes.func.isRequired,
  updateCutTarget: PropTypes.func.isRequired,
  updateEditorTarget: PropTypes.func.isRequired
}

export default CSSModules(MenuItem, styles, {allowMultiple: true})
