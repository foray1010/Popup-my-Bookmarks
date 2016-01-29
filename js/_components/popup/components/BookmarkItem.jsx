import {element} from 'deku'
import debounce from 'lodash.debounce'

import {
  getBookmarkType,
  getFlatTree,
  isFolder,
  isFolderOpened,
  openMultipleBookmarks,
  openOptionsPage
} from '../functions'
import {
  putDragIndicator,
  removeDragIndicator,
  replaceTreeInfoByIndex,
  removeTreeInfosFromIndex,
  updateDragTarget,
  updateMenuTarget,
  updateMousePosition
} from '../actions'
import {
  TYPE_BOOKMARK,
  TYPE_FOLDER,
  TYPE_NO_BOOKMARK,
  TYPE_ROOT_FOLDER,
  TYPE_SEPARATOR
} from '../constants'
import chromep from '../../lib/chromePromise'

const dragHackEl = document.getElementById('drag-hack')
const msgAlertBookmarklet = chrome.i18n.getMessage('alert_bookmarklet')

const afterRender = (model) => window.requestAnimationFrame(async () => {
  const {props} = model

  const {itemInfo} = props

  const bookmarkType = getBookmarkType(itemInfo)

  if (bookmarkType === TYPE_BOOKMARK) {
    const el = document.getElementById(itemInfo.id)

    if (el) {
      const tooltip = await getTooltip(model)

      if (tooltip) {
        el.title = tooltip
      }
    }
  }
})

const clickHandler = (model) => async (evt) => {
  evt.preventDefault()

  const {context, dispatch, props} = model

  const {itemInfo, treeIndex} = props
  const {options, trees} = context

  const bookmarkType = getBookmarkType(itemInfo)

  switch (bookmarkType) {
    case TYPE_ROOT_FOLDER:
    case TYPE_FOLDER:
      if (evt.button === 0) {
        if (options.opFolderBy) {
          if (!isFolderOpened(trees, itemInfo)) {
            dispatch(await openFolder(model))
          } else {
            dispatch(removeTreeInfosFromIndex(treeIndex + 1))
          }
        }
      } else {
        openMultipleBookmarks(model, itemInfo, 0)
      }
      break

    case TYPE_SEPARATOR:
    case TYPE_BOOKMARK:
      openBookmark(model, evt)
      break

    default:
  }
}

const contextMenuHandler = (model) => (evt) => {
  // disable native context menu
  evt.preventDefault()

  const {dispatch, props} = model

  const {itemInfo} = props

  dispatch([
    updateMousePosition({
      x: evt.x,
      y: evt.y
    }),
    updateMenuTarget(itemInfo)
  ])
}

const debouncedDragEnterHandler = debounce(async (model, evt) => {
  const {context, dispatch, props} = model

  const {dragTarget, itemOffsetHeight} = context
  const {itemInfo, treeIndex} = props

  const actionList = []
  const isDragTarget = dragTarget.id === itemInfo.id
  const isPlaceAfter = evt.offsetY > itemOffsetHeight / 2

  const shouldRemoveDragIndicator = (() => {
    const isSiblingOfDragTarget = (
      dragTarget.parentId === itemInfo.parentId &&
      Math.abs(dragTarget.index - itemInfo.index) === 1
    )

    if (isSiblingOfDragTarget) {
      const isDragTargetAfterItemInfo = dragTarget.index - itemInfo.index > 0

      if (isPlaceAfter) {
        return isDragTargetAfterItemInfo
      } else {
        return !isDragTargetAfterItemInfo
      }
    }

    return (
      isDragTarget ||
      getBookmarkType(itemInfo) === TYPE_ROOT_FOLDER
    )
  })()

  // item cannot be the parent folder of itself
  if (!isDragTarget && isFolder(itemInfo)) {
    actionList.push(await openFolder(model))
  } else {
    actionList.push(removeTreeInfosFromIndex(treeIndex + 1))
  }

  if (shouldRemoveDragIndicator) {
    actionList.push(removeDragIndicator())
  } else {
    actionList.push(putDragIndicator(itemInfo, isPlaceAfter))
  }

  dispatch(actionList)
}, 50)

const debouncedMouseHandler = debounce(async (model, evt) => {
  const {context, dispatch, props} = model

  const {itemInfo, treeIndex} = props
  const {options, searchKeyword, trees} = context

  switch (evt.type) {
    case 'mouseenter':
      if (!searchKeyword && !options.opFolderBy) {
        if (isFolder(itemInfo)) {
          if (!isFolderOpened(trees, itemInfo)) {
            dispatch(await openFolder(model))
          }
        } else {
          dispatch(removeTreeInfosFromIndex(treeIndex + 1))
        }
      }
      break

    case 'mouseleave':
      break

    default:
  }
}, 200)

const dragEndHandler = (model) => async () => {
  const {context, dispatch} = model

  const {dragIndicator, dragTarget} = context

  // remove cached dragTargetEl
  dragHackEl.innerHTML = ''

  if (dragIndicator) {
    await chromep.bookmarks.move(dragTarget.id, {
      parentId: dragIndicator.parentId,
      index: dragIndicator.index
    })
  }

  dispatch([
    removeDragIndicator(),
    updateDragTarget(null)
  ])
}

const dragStartHandler = (model) => () => {
  const {dispatch, props} = model

  const {itemInfo, treeIndex} = props

  // hack to prevent dragover and dragend event stop working when dragTargetEl is removed
  setTimeout(() => {
    const dragTargetEl = document.getElementById(itemInfo.id)

    // create a cloned dragged item to replace the original one
    const clonedDragTargetEl = dragTargetEl.cloneNode(true)
    dragTargetEl.parentNode.insertBefore(clonedDragTargetEl, dragTargetEl)

    // move the original one to #drag-hack
    // it can prevent dragged item from removing by removeTreeInfosFromIndex,
    // which stop dragend event from firing
    dragHackEl.appendChild(dragTargetEl)

    dispatch([
      removeTreeInfosFromIndex(treeIndex + 1),
      updateDragTarget(itemInfo)
    ])
  })
}

function getOpenBookmarkHandlerId(model, evt) {
  const {context} = model

  const {options} = context

  const mouseButton = evt.button

  let switcher

  if (mouseButton === 0) {
    switcher = 'Left'

    if (evt.ctrlKey || evt.metaKey) {
      switcher += 'Ctrl'
    } else if (evt.shiftKey) {
      switcher += 'Shift'
    }
  } else {
    switcher = 'Middle'
  }

  return options['clickBy' + switcher]
}

async function getTooltip(model) {
  const {context, props} = model

  const {itemInfo} = props
  const {options, searchKeyword} = context

  const tooltipArr = []

  if (options.tooltip) {
    tooltipArr.push(itemInfo.title, itemInfo.url)
  }

  if (searchKeyword) {
    const breadcrumbArr = []

    const getBreadcrumb = async (breadId) => {
      const results = await chromep.bookmarks.get(breadId)

      const thisItemInfo = results[0]

      breadcrumbArr.unshift(thisItemInfo.title)

      if (thisItemInfo.parentId === '0') {
        tooltipArr.unshift(breadcrumbArr.join(' > '))
      } else {
        await getBreadcrumb(thisItemInfo.parentId)
      }
    }

    await getBreadcrumb(itemInfo.parentId)
  }

  return tooltipArr.join('\n')
}

function openBookmark(model, evt) {
  const {context, props} = model

  const {itemInfo} = props
  const {options} = context

  const handlerId = getOpenBookmarkHandlerId(model, evt)
  const itemUrl = itemInfo.url

  switch (handlerId) {
    case 0: // current tab
    case 1: // current tab (w/o closing PmB)
      if (itemUrl.startsWith('javascript:')) {
        if (options.bookmarklet) {
          chrome.tabs.executeScript(null, {code: itemUrl})
        } else if (window.confirm(msgAlertBookmarklet)) {
          openOptionsPage()
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

    default:
  }

  if (handlerId !== 1 && handlerId !== 4) {
    setTimeout(window.close, 200)
  }
}

async function openFolder(model) {
  const {props} = model

  const {itemInfo, treeIndex} = props

  const nextTreeIndex = treeIndex + 1
  const treeInfo = await getFlatTree(itemInfo.id)

  return replaceTreeInfoByIndex(nextTreeIndex, treeInfo)
}

const BookmarkItem = {
  onCreate(model) {
    afterRender(model)
  },

  onUpdate(model) {
    afterRender(model)
  },

  render(model) {
    const {context, props} = model

    const {itemInfo} = props
    const {cutTarget, dragTarget, menuTarget, searchKeyword} = context

    const bookmarkType = getBookmarkType(itemInfo)
    const compiledDragEnterHandler = (evt) => debouncedDragEnterHandler(model, evt)
    const compiledMouseHandler = (evt) => debouncedMouseHandler(model, evt)
    const itemClasses = [
      'item',
      'bookmark-item'
    ]
    const itemTitle = itemInfo.title || itemInfo.url || null

    let iconSrc = null
    let isDraggable = true

    if (isFolder(itemInfo)) {
      iconSrc = '/img/folder.png'
    }

    switch (bookmarkType) {
      case TYPE_NO_BOOKMARK:
      case TYPE_ROOT_FOLDER:
        isDraggable = false
        itemClasses.push(bookmarkType)
        break

      case TYPE_SEPARATOR:
        itemClasses.push(bookmarkType)
        break

      case TYPE_BOOKMARK:
        iconSrc = `chrome://favicon/${itemInfo.url}`
        break

      default:
    }

    const isCutTarget = cutTarget && cutTarget.id === itemInfo.id
    const isDragTarget = dragTarget && dragTarget.id === itemInfo.id
    if (isCutTarget || isDragTarget) {
      itemClasses.push('grey-item')
    }

    const isMenuTarget = menuTarget && menuTarget.id === itemInfo.id
    if (isMenuTarget) {
      itemClasses.push('selected')
    }

    if (searchKeyword) {
      isDraggable = false
    }

    return (
      <li
        id={itemInfo.id}
        draggable={String(isDraggable)}
        onDragEnd={dragEndHandler(model)}
        onDragEnter={compiledDragEnterHandler}
        onDragStart={dragStartHandler(model)}
      >
        <a
          class={itemClasses.join(' ')}
          href={itemInfo.url || ''}
          draggable='false'
          onClick={clickHandler(model)}
          onContextMenu={contextMenuHandler(model)}
          onMouseEnter={compiledMouseHandler}
          onMouseLeave={compiledMouseHandler}
        >
          <img class='icon' src={iconSrc} alt='' draggable='false' />
          <span class='no-text-overflow'>{itemTitle}</span>
        </a>
      </li>
    )
  }
}

export default BookmarkItem
