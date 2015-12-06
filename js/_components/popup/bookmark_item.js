import debounce from 'lodash.debounce'
import element from 'virtual-element'

const debouncedMouseHandler = debounce((event, {props}) => {
  const isSearching = props.isSearching
  const itemInfo = props.itemInfo

  switch (event.type) {
    case 'mouseenter':
      if (!isSearching && !globals.options.opFolderBy) {
        if (globals.isFolder(itemInfo)) {
          if (!globals.isFolderOpened(props.trees, itemInfo)) {
            openFolder(props)
          }
        } else {
          globals.removeTreeInfoFromIndex(props.trees, props.treeIndex + 1)
        }
      }

      break

    case 'mouseleave':
      break
  }
}, 200)

function afterMount({props}, el) {
  const itemInfo = props.itemInfo

  if (globals.getBookmarkType(itemInfo) === 'bookmark') {
    setTooltip(el, props)
  }
}

function beforeUpdate() {
  // prevent using outdated props.trees
  debouncedMouseHandler.cancel()
}

function clickHandler(event, {props}) {
  const itemInfo = props.itemInfo

  const bookmarkType = globals.getBookmarkType(itemInfo)

  switch (bookmarkType) {
    case 'root-folder':
    case 'folder':
      if (event.button === 0) {
        if (globals.options.opFolderBy) {
          if (!globals.isFolderOpened(props.trees, itemInfo)) {
            openFolder(props)
          } else {
            globals.removeTreeInfoFromIndex(props.trees, props.treeIndex + 1)
          }
        }
      } else {
        globals.openMultipleBookmarks(itemInfo, 0)
      }

      break

    case 'separator':
    case 'bookmark':
      openBookmark(getOpenBookmarkHandlerId(event), itemInfo.url)
      break
  }
}

function contextMenuHandler(event, {props}) {
  // disable native context menu
  event.preventDefault()

  const itemInfo = props.itemInfo

  globals.setRootState({
    menuTarget: itemInfo,
    mousePos: Immutable({x: event.x, y: event.y})
  })
}

function dragEndHandler(event, {props}) {

}

function dragOverHandler(event, {props}) {

}

function dragStartHandler(event, {props}) {

}

function getOpenBookmarkHandlerId(event) {
  const mouseButton = event.button

  let switcher

  if (mouseButton === 0) {
    switcher = 'Left'

    if (event.ctrlKey || event.metaKey) {
      switcher += 'Ctrl'
    } else if (event.shiftKey) {
      switcher += 'Shift'
    }
  } else {
    switcher = 'Middle'
  }

  return globals.options['clickBy' + switcher]
}

function openBookmark(handlerId, itemUrl) {
  switch (handlerId) {
    case 0: // current tab
    case 1: // current tab (w/o closing PmB)
      if (itemUrl.startsWith('javascript:')) {
        const msgAlertBookmarklet = chrome.i18n.getMessage('alert_bookmarklet')

        if (globals.options.bookmarklet) {
          chrome.tabs.executeScript(null, {code: itemUrl})
        } else if (confirm(msgAlertBookmarklet)) {
          globals.openOptionsPage()
        }
      } else {
        chrome.tabs.update({url: itemUrl})
      }

      break

    case 2: // new tab
    case 3: // background tab
    case 4: // background tab (w/o closing PmB)
      chrome.tabs.create({
        url: itemUrl,
        active: handlerId === 2
      })
      break

    case 5: // new window
    case 6: // incognito window
      chrome.windows.create({
        url: itemUrl,
        incognito: handlerId === 6
      })
      break
  }

  if (handlerId !== 1 && handlerId !== 4) {
    setTimeout(window.close, 200)
  }
}

async function openFolder(props) {
  const newTrees = props.trees.asMutable()
  const nextTreeIndex = props.treeIndex + 1
  const treeInfo = await globals.getFlatTree(props.itemInfo.id)

  newTrees[nextTreeIndex] = treeInfo

  globals.setRootState({
    trees: Immutable(newTrees)
  })
}

function render({props}) {
  const isSearching = props.isSearching
  const itemClasses = [
    'item',
    'bookmark-item'
  ]
  const itemInfo = props.itemInfo

  const bookmarkType = globals.getBookmarkType(itemInfo)
  const itemTitle = itemInfo.title || itemInfo.url

  let iconSrc
  let isDraggable = true

  if (globals.isFolder(itemInfo)) {
    iconSrc = '/img/folder.png'
  }

  switch (bookmarkType) {
    case 'no-bookmark':
    case 'root-folder':
      isDraggable = false
      itemClasses.push(bookmarkType)
      break

    case 'separator':
      itemClasses.push(bookmarkType)
      break

    case 'bookmark':
      iconSrc = `chrome://favicon/${itemInfo.url}`
      break
  }

  if (isSearching) {
    isDraggable = false
  }

  return (
    <div
      id={itemInfo.id}
      class={itemClasses.join(' ')}
      draggable={isDraggable}
      onClick={clickHandler}
      onContextMenu={contextMenuHandler}
      onDragEnd={dragEndHandler}
      onDragOver={dragOverHandler}
      onDragStart={dragStartHandler}
      onMouseEnter={debouncedMouseHandler}
      onMouseLeave={debouncedMouseHandler}>
      <img class='icon' src={iconSrc} alt='' draggable='false' />
      <div class='no-text-overflow'>{itemTitle}</div>
    </div>
  )
}

function setTooltip(el, props) {
  const isSearching = props.isSearching
  const itemInfo = props.itemInfo
  const tooltipArr = []

  const setTitle = () => {
    if (tooltipArr.length) {
      el.title = tooltipArr.join('\n')
    }
  }

  if (globals.options.tooltip) {
    tooltipArr.push(itemInfo.title, itemInfo.url)
  }

  if (isSearching) {
    const breadcrumbArr = []

    const getBreadcrumb = async function (breadId) {
      const results = await chromep.bookmarks.get(breadId)

      const thisItemInfo = results[0]

      breadcrumbArr.unshift(thisItemInfo.title)

      if (thisItemInfo.parentId !== '0') {
        getBreadcrumb(thisItemInfo.parentId)
      } else {
        tooltipArr.unshift(breadcrumbArr.join(' > '))

        setTitle()
      }
    }

    getBreadcrumb(itemInfo.parentId)
  } else {
    setTitle()
  }
}

export default {afterMount, beforeUpdate, render}
