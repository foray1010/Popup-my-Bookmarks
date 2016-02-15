import {bind} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'

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
  TYPE_SEPARATOR
} from '../constants'
import {
  updateCopyTarget,
  updateCutTarget,
  updateEditorTarget,
  updateMenuTarget
} from '../actions'
import chromep from '../../lib/chromePromise'

async function addCurrentPage(menuTarget) {
  const results = await chromep.tabs.query({
    currentWindow: true,
    active: true
  })

  const currentTab = results[0]

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

function getMenuItemNum(menuItem) {
  const menuItemList = document.getElementsByClassName('menu-item')

  return Array.from(menuItemList).indexOf(menuItem)
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

  let newChildrenInfo = []
  let selectedClassifiedItems = genClassifiedItems()

  /**
   * Split all bookmarks into n main group,
   * where n = the number of separators + 1
   * Each main group contains 3 small groups
   * (Separators, Folders, Bookmarks)
   */
  for (const itemInfo of childrenInfo) {
    let classifiedItemsIndex

    switch (getBookmarkType(itemInfo)) {
      case TYPE_FOLDER:
        classifiedItemsIndex = 1
        break

      case TYPE_SEPARATOR:
        classifiedItemsIndex = 0
        selectedClassifiedItems = genClassifiedItems()
        break

      case TYPE_BOOKMARK:
        classifiedItemsIndex = 2
        break

      default:
    }

    selectedClassifiedItems[classifiedItemsIndex].push(itemInfo)
  }

  // Concatenate all lists into single list
  for (const thisChildrenInfo of classifiedItemsList) {
    for (const classifiedItems of thisChildrenInfo) {
      newChildrenInfo = newChildrenInfo.concat(
        sortByTitle(classifiedItems)
      )
    }
  }

  // Sort bookmarks by Selection sort
  const newChildrenInfoLen = newChildrenInfo.length
  for (let index = 0; index < newChildrenInfoLen; index += 1) {
    const itemInfo = newChildrenInfo[index]

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

const mapStateToProps = (state) => ({
  copyTarget: state.copyTarget,
  cutTarget: state.cutTarget,
  menuTarget: state.menuTarget
})

@connect(mapStateToProps)
class MenuItem extends Component {
  constructor() {
    super()

    this.openMultipleBookmarks = openMultipleBookmarks.bind(this)
  }

  @bind
  async clickHandler(evt) {
    evt.preventDefault()

    const {target} = evt
    if (target.classList.contains('grey-item')) return

    const {
      cutTarget,
      dispatch,
      menuTarget
    } = this.props

    const actionList = []
    const menuItemNum = getMenuItemNum(target)

    switch (menuItemNum) {
      case 0: // Open bookmark(s) in background tab or this window
      case 1: // in new window
      case 2: // in incognito window
        await this.openMultipleBookmarks(menuTarget, menuItemNum)
        break

      case 3: // Edit... or Rename...
        actionList.push(updateEditorTarget(menuTarget))
        break

      case 4: // Delete
        await removeBookmarkItem(menuTarget)
        break

      case 5: // Cut
        actionList.push(updateCutTarget(menuTarget))
        break

      case 6: // Copy
        actionList.push(updateCopyTarget(menuTarget))
        break

      case 7: // Paste
        await this.pasteItem()

        if (cutTarget) {
          actionList.push(updateCutTarget(null))
        }
        break

      case 9: // Add folder...
        return

      case 8: // Add current page
        await addCurrentPage(menuTarget)
        break

      case 10: // Add separator
        await createBookmarkBelowMenuTarget(
          menuTarget,
          '- '.repeat(42),
          SEPARATE_THIS_URL
        )
        break

      case 11: // Sort by name
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

      const treeInfo = await chromep.bookmarks.getSubTree(copyTarget.id)

      const itemInfo = treeInfo[0]

      const createdItemInfo = await createBookmarkBelowMenuTarget(
        menuTarget,
        itemInfo.title,
        itemInfo.url
      )

      if (getBookmarkType(itemInfo) === TYPE_FOLDER) {
        await copyChildFn(itemInfo, createdItemInfo.id)
      }
    }

    if (cutTarget) {
      await chromep.bookmarks.move(cutTarget.id, {
        parentId: menuTarget.parentId,
        index: menuTarget.index + 1
      })
    }
  }

  render(props) {
    const {
      copyTarget,
      cutTarget,
      menuItemKey
    } = props

    const menuItemClasses = [
      'item',
      'menu-item'
    ]

    if (menuItemKey === 'paste' && !copyTarget && !cutTarget) {
      menuItemClasses.push('grey-item')
    }

    return (
      <li>
        <a
          className={menuItemClasses.join(' ')}
          href=''
          onClick={this.clickHandler}
        >
          {chrome.i18n.getMessage(menuItemKey)}
        </a>
      </li>
    )
  }
}

export default MenuItem
