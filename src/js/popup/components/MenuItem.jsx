import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, PropTypes, PureComponent} from 'react'
import classNames from 'classnames'
import CSSModules from 'react-css-modules'

import {
  getBookmarkType,
  isFolder,
  openMultipleBookmarks,
  resetBodySize,
  sortByTitle
} from '../functions'
import {
  SEPARATE_THIS_URL,
  TYPE_BOOKMARK,
  TYPE_FOLDER,
  TYPE_NO_BOOKMARK,
  TYPE_SEPARATOR
} from '../constants'
import {
  updateCopyTarget,
  updateCutTarget,
  updateEditorTarget,
  updateIsCreatingNewFolder,
  updateMenuTarget
} from '../actions'
import chromep from '../../common/lib/chromePromise'

import styles from '../../../css/popup/menu-item.css'

async function addCurrentPage(menuTarget) {
  const [currentTab] = await chromep.tabs.query({
    currentWindow: true,
    active: true
  })

  await createBookmarkBelowMenuTarget(menuTarget, currentTab.title, currentTab.url)
}

async function createBookmarkBelowMenuTarget(menuTarget, title, url) {
  const createdItemInfo = await chromep.bookmarks.create({
    index: menuTarget.index + 1,
    parentId: menuTarget.parentId,
    title: title.trim(),
    url: url && url.trim()
  })

  return createdItemInfo
}

async function removeBookmarkItem(menuTarget) {
  const removeFunc = isFolder(menuTarget) ?
    chromep.bookmarks.removeTree :
    chromep.bookmarks.remove

  await removeFunc(menuTarget.id)
}

async function sortByName(parentId) {
  const childrenInfo = await chromep.bookmarks.getChildren(parentId)
  const classifiedItemsList = []

  const genClassifiedItems = () => {
    const newClassifiedItems = [
      [/* Separators */],
      [/* Folders */],
      [/* Bookmarks */]
    ]

    classifiedItemsList.push(newClassifiedItems)

    return newClassifiedItems
  }

  /**
   * Split all bookmarks into n main group,
   * where n = the number of separators + 1
   * Each main group contains 3 small groups
   * (Separators, Folders, Bookmarks)
   */
  let selectedClassifiedItems = genClassifiedItems()
  for (const itemInfo of childrenInfo) {
    let classifiedItemsIndex

    switch (getBookmarkType(itemInfo)) {
      case TYPE_SEPARATOR:
        classifiedItemsIndex = 0
        selectedClassifiedItems = genClassifiedItems()
        break

      case TYPE_FOLDER:
        classifiedItemsIndex = 1
        break

      case TYPE_BOOKMARK:
        classifiedItemsIndex = 2
        break

      default:
    }

    selectedClassifiedItems[classifiedItemsIndex].push(itemInfo)
  }

  // Concatenate all lists into single list
  let newChildrenInfo = []
  for (const thisChildrenInfo of classifiedItemsList) {
    for (const classifiedItems of thisChildrenInfo) {
      newChildrenInfo = newChildrenInfo.concat(
        sortByTitle(classifiedItems)
      )
    }
  }

  // Sort bookmarks by Selection sort
  for (const [index, itemInfo] of newChildrenInfo.entries()) {
    const oldIndex = childrenInfo.indexOf(itemInfo)

    if (oldIndex !== index) {
      // move the item from old index to new index
      childrenInfo.splice(index, 0, childrenInfo.splice(oldIndex, 1)[0])

      await chromep.bookmarks.move(itemInfo.id, {
        index: index + (index > oldIndex ? 1 : 0)
      })
    }
  }
}

class MenuItem extends PureComponent {
  @autobind
  async handleClick(evt) {
    evt.preventDefault()

    const {
      cutTarget,
      dispatch,
      isUnclickable,
      menuItemKey,
      menuTarget,
      options
    } = this.props

    if (isUnclickable) return

    const actionList = []
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
        actionList.push(updateEditorTarget(menuTarget))
        break

      case 'del':
        await removeBookmarkItem(menuTarget)
        break

      case 'cut':
        actionList.push(updateCutTarget(menuTarget))
        break

      case 'copy':
        actionList.push(updateCopyTarget(menuTarget))
        break

      case 'paste':
        await this.pasteItem()

        if (cutTarget) {
          actionList.push(updateCutTarget(null))
        }
        break

      case 'addPage':
        await addCurrentPage(menuTarget)
        break

      case 'addFolder':
        actionList.push(
          updateEditorTarget(menuTarget),
          updateIsCreatingNewFolder(true)
        )
        break

      case 'addSeparator':
        await createBookmarkBelowMenuTarget(
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

    resetBodySize()

    actionList.push(updateMenuTarget(null))
    dispatch(actionList)
  }

  async pasteItem() {
    const {
      copyTarget,
      cutTarget,
      menuTarget
    } = this.props

    if (copyTarget) {
      const copyChildFn = async (thisTreeInfo, parentId) => {
        for (const thisItemInfo of thisTreeInfo.children) {
          const thisCreatedItemInfo = await chromep.bookmarks.create({
            parentId: parentId,
            title: thisItemInfo.title,
            url: thisItemInfo.url
          })

          if (getBookmarkType(thisItemInfo) === TYPE_FOLDER) {
            await copyChildFn(thisItemInfo, thisCreatedItemInfo.id)
          }
        }
      }

      const [treeInfo] = await chromep.bookmarks.getSubTree(copyTarget.id)

      const createdItemInfo = await createBookmarkBelowMenuTarget(
        menuTarget,
        treeInfo.title,
        treeInfo.url
      )

      if (getBookmarkType(treeInfo) === TYPE_FOLDER) {
        await copyChildFn(treeInfo, createdItemInfo.id)
      }
    }

    if (cutTarget) {
      await chromep.bookmarks.move(cutTarget.id, {
        parentId: menuTarget.parentId,
        index: menuTarget.index + 1
      })
    }
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
        <a
          styleName={thisStyleName}
          href=''
          tabIndex={isUnclickable ? -1 : null} // not accessible by Tab
          onClick={this.handleClick}
        >
          {chrome.i18n.getMessage(menuItemKey)}
        </a>
      </li>
    )
  }
}

MenuItem.propTypes = {
  copyTarget: PropTypes.object,
  cutTarget: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  isUnclickable: PropTypes.bool.isRequired,
  menuItemKey: PropTypes.string.isRequired,
  menuTarget: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired
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

export default connect(mapStateToProps)(
  CSSModules(MenuItem, styles, {allowMultiple: true})
)
