import element from 'virtual-element'
import forEach from 'lodash.foreach'

function addCurrentPage(menuTarget) {
  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, (results) => {
    const currentTab = results[0]

    createBookmarkItem(menuTarget, currentTab.title, currentTab.url)
  })
}

function afterRender({props}, el) {
  const menuTarget = props.menuTarget

  const isHidden = !menuTarget

  if (!isHidden) {
    setMenuPos(el, props.mousePos)
  }
}

function afterUpdate({props}, prevProps) {
  const menuTarget = props.menuTarget
  const prevMenuTarget = prevProps.menuTarget

  if (prevMenuTarget !== menuTarget) {
    if (menuTarget) {
      toggleSelected(menuTarget, 'add')
    }

    if (prevMenuTarget) {
      toggleSelected(prevMenuTarget, 'remove')
    }
  }
}

function closeMenu() {
  globals.setRootState({
    menuTarget: null
  })
}

function createBookmarkItem(menuTarget, title, url) {
  chrome.bookmarks.create({
    parentId: menuTarget.parentId,
    title: title,
    url: url,
    index: menuTarget.index + 1
  })
}

function getChildrenHiddenStatus(props) {
  const menuTarget = props.menuTarget

  let childrenHiddenStatus = [false, false, false, false, false]

  switch (globals.getBookmarkType(menuTarget)) {
    case 'root-folder':
      childrenHiddenStatus = [false, true, true, true, true]
      break

    case 'bookmark':
      if (props.searchResult) {
        childrenHiddenStatus = [false, false, false, true, true]
      }

      break

    case 'no-bookmark':
      childrenHiddenStatus = [true, true, false, false, true]
      break
  }

  return childrenHiddenStatus
}

function getMenuItemNum(menuItem) {
  const menuItemList = document.getElementsByClassName('menu-item')

  return Array.prototype.indexOf.call(menuItemList, menuItem)
}

function menuClickEvent(event, {props}) {
  const menuTarget = props.menuTarget
  const target = event.target

  const menuItemNum = getMenuItemNum(target)

  switch (menuItemNum) {
    case 0: // Open bookmark(s) in background tab or this window
    case 1: // in new window
    case 2: // in incognito window
      globals.openMultipleBookmarks(menuTarget, menuItemNum)
      break

    case 3: // Edit... or Rename...
      globals.setRootState({
        editorTarget: menuTarget,
        menuTarget: null
      })
      return

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
        globals.separateThisUrl
      )
      break

    case 11: // Sort by name
      sortByName(menuTarget.parentId)
      break
  }

  closeMenu()
}

function removeBookmarkItem(menuTarget) {
  if (globals.isFolder(menuTarget)) {
    chrome.bookmarks.removeTree(menuTarget.id)
  } else {
    chrome.bookmarks.remove(menuTarget.id)
  }
}

function render({props}) {
  const menuTarget = props.menuTarget

  const isHidden = !menuTarget

  let menuItems

  if (menuTarget) {
    const childrenHiddenStatus = getChildrenHiddenStatus(props)
    const menuPattern = [
      [],
      [],
      ['cut', 'copy', 'paste'],
      ['addPage', 'addFolder', 'addSeparator'],
      ['sortByName']
    ]

    if (globals.isFolder(menuTarget)) {
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
          <p
            class='item menu-item'
            onClick={menuClickEvent}>
            {chrome.i18n.getMessage(menuItemKey)}
          </p>
        )
      })

      return <div hidden={isMenuAreaHidden}>{menuAreaItems}</div>
    })
  }

  return <div id='menu' hidden={isHidden}>{menuItems}</div>
}

function setMenuPos(el, mousePos) {
  const body = document.body
  const menuHeight = el.offsetHeight
  const menuWidth = el.offsetWidth

  const bodyHeight = body.scrollHeight
  const bodyWidth = body.offsetWidth

  if (menuHeight > bodyHeight) {
    body.style.height = menuHeight + 'px'
  }

  if (menuWidth > bodyWidth) {
    body.style.width = menuWidth + 'px'
  }

  const bottomPos = bodyHeight - menuHeight - mousePos.y
  const rightPos = bodyWidth - menuWidth - mousePos.x

  el.style.bottom = Math.max(bottomPos, 0) + 'px'
  el.style.right = Math.max(rightPos, 0) + 'px'
}

function sortByName(parentId) {
  return chromep.bookmarks.getChildren(parentId).then((childrenInfo) => {
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
    forEach(childrenInfo, (itemInfo) => {
      let classifiedItemsIndex

      switch (globals.getBookmarkType(itemInfo)) {
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
      }

      selectedClassifiedItems[classifiedItemsIndex].push(itemInfo)
    })

    // Concatenate all lists into single list
    forEach(classifiedItemsList, (thisChildrenInfo) => {
      forEach(thisChildrenInfo, (classifiedItems) => {
        newChildrenInfo = newChildrenInfo.concat(
          globals.sortByTitle(classifiedItems)
        )
      })
    })

    // Sort bookmarks by Selection sort
    forEach(newChildrenInfo, (itemInfo, index) => {
      const oldIndex = childrenInfo.indexOf(itemInfo)

      if (oldIndex !== index) {
        // move the item from old index to new index
        childrenInfo.splice(index, 0, childrenInfo.splice(oldIndex, 1)[0])

        chrome.bookmarks.move(itemInfo.id, {
          index: index + (index > oldIndex ? 1 : 0)
        })
      }
    })
  })
}

function toggleSelected(menuTarget, toggleParam) {
  const menuTargetElem = document.getElementById(menuTarget.id)

  if (menuTargetElem) {
    menuTargetElem.classList[toggleParam]('selected')
  }
}

export default {afterRender, afterUpdate, render}
