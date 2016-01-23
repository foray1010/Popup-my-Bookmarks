import {element} from 'deku'

import {
  getBookmarkType,
  isFolder,
  openMultipleBookmarks,
  resetBodySize,
  sortByTitle
} from '../functions'
import {
  SEPARATE_THIS_URL
} from '../constants'
import {
  updateEditorTarget,
  updateMenuTarget
} from '../actions'
import chromep from '../../lib/chromePromise'

const menuItemClickHandler = (model) => (evt) => {
  evt.preventDefault()

  const {context, dispatch} = model

  const {menuTarget} = context

  const menuItemNum = getMenuItemNum(evt.target)

  switch (menuItemNum) {
    case 0: // Open bookmark(s) in background tab or this window
    case 1: // in new window
    case 2: // in incognito window
      openMultipleBookmarks(model, menuTarget, menuItemNum)
      break

    case 3: // Edit... or Rename...
      dispatch(updateEditorTarget(menuTarget))
      break

    case 4: // Delete
      removeBookmarkItem(menuTarget)
      break

    case 5: // Cut
    case 6: // Copy
    case 7: // Paste
      break

    case 9: // Add folder...
      return

    case 8: // Add current page
      addCurrentPage(menuTarget)
      break

    case 10: // Add separator
      createBookmarkItem(
        menuTarget,
        '- '.repeat(42),
        SEPARATE_THIS_URL
      )
      break

    case 11: // Sort by name
      sortByName(menuTarget.parentId)
      break

    default:
  }

  closeMenu(model)
}

async function addCurrentPage(menuTarget) {
  const results = await chromep.tabs.query({
    currentWindow: true,
    active: true
  })

  const currentTab = results[0]

  createBookmarkItem(menuTarget, currentTab.title, currentTab.url)
}

function closeMenu(model) {
  const {dispatch} = model

  resetBodySize()

  dispatch(updateMenuTarget(null))
}

function createBookmarkItem(menuTarget, title, url) {
  chrome.bookmarks.create({
    index: menuTarget.index + 1,
    parentId: menuTarget.parentId,
    title: title,
    url: url
  })
}

function getChildrenHiddenStatus(context) {
  const {menuTarget, searchKeyword} = context

  let childrenHiddenStatus = [false, false, false, false, false]

  switch (getBookmarkType(menuTarget)) {
    case 'root-folder':
      childrenHiddenStatus = [false, true, true, true, true]
      break

    case 'bookmark':
      if (searchKeyword) {
        childrenHiddenStatus = [false, false, false, true, true]
      }

      break

    case 'no-bookmark':
      childrenHiddenStatus = [true, true, false, false, true]
      break

    default:
  }

  return childrenHiddenStatus
}

function getMenuItemNum(menuItem) {
  const menuItemList = document.getElementsByClassName('menu-item')

  return Array.from(menuItemList).indexOf(menuItem)
}

function removeBookmarkItem(menuTarget) {
  if (isFolder(menuTarget)) {
    chrome.bookmarks.removeTree(menuTarget.id)
  } else {
    chrome.bookmarks.remove(menuTarget.id)
  }
}

function setMenuPosition(model) {
  const {context, path} = model

  const {menuTarget, mousePosition} = context

  const el = document.getElementById(path)

  const isHidden = !menuTarget

  let bottomPosPx = ''
  let rightPosPx = ''

  if (!isHidden) {
    const body = document.body
    const html = document.getElementsByTagName('html')[0]
    const menuHeight = el.offsetHeight
    const menuWidth = el.offsetWidth

    const bodyWidth = body.offsetWidth
    const htmlHeight = html.clientHeight

    const bottomPos = htmlHeight - menuHeight - mousePosition.y
    const rightPos = bodyWidth - menuWidth - mousePosition.x

    if (menuHeight > htmlHeight) {
      body.style.height = menuHeight + 'px'
    }

    if (menuWidth > bodyWidth) {
      body.style.width = menuWidth + 'px'
    }

    bottomPosPx = Math.max(bottomPos, 0) + 'px'
    rightPosPx = Math.max(rightPos, 0) + 'px'
  }

  el.style.bottom = bottomPosPx
  el.style.right = rightPosPx
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
      case 'folder':
        classifiedItemsIndex = 1
        break

      case 'separator':
        classifiedItemsIndex = 0
        selectedClassifiedItems = genClassifiedItems()
        break

      case 'bookmark':
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
  newChildrenInfo.forEach((itemInfo, index) => {
    const oldIndex = childrenInfo.indexOf(itemInfo)

    if (oldIndex !== index) {
      // move the item from old index to new index
      childrenInfo.splice(index, 0, childrenInfo.splice(oldIndex, 1)[0])

      chrome.bookmarks.move(itemInfo.id, {
        index: index + (index > oldIndex ? 1 : 0)
      })
    }
  })
}

const Menu = {
  onUpdate(model) {
    setMenuPosition(model)
  },

  render(model) {
    const {context, path} = model

    const {menuTarget} = context

    const isHidden = !menuTarget

    let menuItems = null

    if (menuTarget) {
      const childrenHiddenStatus = getChildrenHiddenStatus(context)
      const compiledMenuItemClickHandler = menuItemClickHandler(model)
      const menuPattern = [
        [],
        [],
        ['cut', 'copy', 'paste'],
        ['addPage', 'addFolder', 'addSeparator'],
        ['sortByName']
      ]

      if (isFolder(menuTarget)) {
        menuPattern[0] = ['openAll', 'openAllInN', 'openAllInI']
        menuPattern[1] = ['rename', 'del']
      } else {
        menuPattern[0] = ['openInB', 'openInN', 'openInI']
        menuPattern[1] = ['edit', 'del']
      }

      menuItems = menuPattern.map((menuAreaKeys, menuAreaIndex) => {
        const isMenuAreaHidden = childrenHiddenStatus[menuAreaIndex]
        const menuAreaItems = menuAreaKeys.map((menuItemKey) => {
          return (
            <li>
              <a
                class='item menu-item'
                href=''
                onClick={compiledMenuItemClickHandler}
              >
                {chrome.i18n.getMessage(menuItemKey)}
              </a>
            </li>
          )
        })

        return (
          <ul
            class='menu-area'
            hidden={isMenuAreaHidden}
          >
            {menuAreaItems}
          </ul>
        )
      })
    }

    return <div id={path} class='menu' hidden={isHidden}>{menuItems}</div>
  }
}

export default Menu
