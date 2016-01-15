import {element} from 'deku'
import debounce from 'lodash.debounce'

import {
  replaceTreeInfoByIndex,
  removeTreeInfosFromIndex,
  updateMenuTarget,
  updateMousePosition
} from '../actions'

const msgAlertBookmarklet = chrome.i18n.getMessage('alert_bookmarklet')

const clickHandler = (model) => (evt) => {
  evt.preventDefault()

  const {context, dispatch, props} = model

  const {itemInfo, treeIndex} = props
  const {trees} = context

  const bookmarkType = globals.getBookmarkType(itemInfo)

  switch (bookmarkType) {
    case 'root-folder':
    case 'folder':
      if (evt.button === 0) {
        if (context.options.opFolderBy) {
          if (!globals.isFolderOpened(trees, itemInfo)) {
            openFolder(model)
          } else {
            dispatch(removeTreeInfosFromIndex(treeIndex + 1))
          }
        }
      } else {
        globals.openMultipleBookmarks(model, itemInfo, 0)
      }

      break

    case 'separator':
    case 'bookmark':
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

const debouncedMouseHandler = (model) => debounce((evt) => {
  const {context, dispatch, props} = model

  const {itemInfo, treeIndex} = props
  const {searchKeyword, trees} = context

  switch (evt.type) {
    case 'mouseenter':
      if (!searchKeyword && !context.options.opFolderBy) {
        if (globals.isFolder(itemInfo)) {
          if (!globals.isFolderOpened(trees, itemInfo)) {
            openFolder(model)
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

const dragEndHandler = (model) => (evt) => {

}

const dragOverHandler = (model) => (evt) => {

}

const dragStartHandler = (model) => (evt) => {

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

  if (tooltipArr.length) {
    return tooltipArr.join('\n')
  }
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

    default:
  }

  if (handlerId !== 1 && handlerId !== 4) {
    setTimeout(window.close, 200)
  }
}

async function openFolder(model) {
  const {dispatch, props} = model

  const {itemInfo, treeIndex} = props

  const nextTreeIndex = treeIndex + 1
  const treeInfo = await globals.getFlatTree(itemInfo.id)

  dispatch(replaceTreeInfoByIndex(nextTreeIndex, treeInfo))
}

const BookmarkItem = {
  // async afterRender(model) {
  //   const {props} = model

  //   const {itemInfo} = props

  //   const el = document.getElementById(itemInfo.id)

  //   if (el) {
  //     el.title = await getTooltip(model)
  //   }
  // },

  render(model) {
    const {context, props} = model

    const {itemInfo} = props
    const {menuTarget, searchKeyword} = context

    const bookmarkType = globals.getBookmarkType(itemInfo)
    const compiledMouseHandler = debouncedMouseHandler(model)
    const itemClasses = [
      'item',
      'bookmark-item'
    ]
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

      default:
    }

    if (searchKeyword) {
      isDraggable = false
    }

    if (menuTarget && menuTarget.id === itemInfo.id) {
      itemClasses.push('selected')
    }

    return (
      <li id={itemInfo.id}>
        <a
          class={itemClasses.join(' ')}
          href=''
          draggable={isDraggable}
          onClick={clickHandler(model)}
          onContextMenu={contextMenuHandler(model)}
          onDragEnd={dragEndHandler(model)}
          onDragOver={dragOverHandler(model)}
          onDragStart={dragStartHandler(model)}
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
