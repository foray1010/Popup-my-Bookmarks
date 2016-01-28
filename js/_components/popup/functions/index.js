import chromep from '../../lib/chromePromise'

import {
  GOLDEN_GAP,
  SEPARATE_THIS_URL,
  TYPE_BOOKMARK,
  TYPE_FOLDER,
  TYPE_NO_BOOKMARK,
  TYPE_ROOT_FOLDER,
  TYPE_SEPARATOR
} from '../constants'
import css from '../../lib/css'

export function genDummyItemInfo() {
  const dummyItemInfo = {}
  const itemInfoFieldNames = [
    'dateAdded',
    'dateGroupModified',
    'id',
    'index',
    'parentId',
    'title'
  ]

  for (const itemInfoFieldName of itemInfoFieldNames) {
    dummyItemInfo[itemInfoFieldName] = null
  }

  return dummyItemInfo
}

export function getBookmarkType(itemInfo) {
  if (/^no-bookmark/.test(itemInfo.id)) {
    return TYPE_NO_BOOKMARK
  }

  if (itemInfo.parentId === '0') {
    return TYPE_ROOT_FOLDER
  }

  if (!itemInfo.url) {
    return TYPE_FOLDER
  }

  if (itemInfo.url.startsWith(SEPARATE_THIS_URL)) {
    return TYPE_SEPARATOR
  }

  return TYPE_BOOKMARK
}

export async function getFlatTree(id) {
  const treeInfo = (await chromep.bookmarks.get(id))[0]

  treeInfo.children = await chromep.bookmarks.getChildren(id)

  return treeInfo
}

export async function getFirstTree(options) {
  const firstTree = await getFlatTree(String(options.defExpand))

  return firstTree
}

export function getSlicedTrees(trees, removeFromIndex) {
  if (trees.length > removeFromIndex) {
    return trees.slice(0, removeFromIndex)
  }

  return trees
}

export function getStyleOptions(options) {
  const {fontFamily, fontSize, setWidth} = options

  // if the font family's name has whitespace, use quote to embed it
  const parsedFontFamily = fontFamily.split(',')
    .map((x) => {
      x = x.trim()

      if (/\s/.test(x)) {
        x = JSON.stringify(x)
      }

      return x
    })
    .join(',')

  const itemHeight = GOLDEN_GAP * 2 + fontSize

  // +1 for border width, GOLDEN_GAP for padding
  const itemOffsetHeight = (1 + GOLDEN_GAP) * 2 + itemHeight

  return {
    fontFamily: parsedFontFamily,
    fontSize: fontSize,
    itemHeight: itemHeight,
    itemOffsetHeight: itemOffsetHeight,
    panelWidth: setWidth
  }
}

export function isFolder(itemInfo) {
  const bookmarkType = getBookmarkType(itemInfo)

  return /folder$/.test(bookmarkType)
}

export function isFolderOpened(trees, itemInfo) {
  return trees.some((treeInfo) => treeInfo.id === itemInfo.id)
}

export function isItemInView(item) {
  const itemBottomOffsetTop = item.offsetTop + item.offsetHeight
  const itemParent = item.parentNode

  const parentScrollTop = itemParent.scrollTop

  return (
    itemBottomOffsetTop > parentScrollTop &&
    itemParent.offsetHeight + parentScrollTop >= itemBottomOffsetTop
  )
}

export async function openMultipleBookmarks(model, itemInfo, menuItemNum) {
  const {context} = model

  const {options} = context

  const urlList = []

  if (isFolder(itemInfo)) {
    const results = await chromep.bookmarks.getSubTree(itemInfo.id)

    const childrenInfo = results[0].children

    for (const thisItemInfo of childrenInfo) {
      if (getBookmarkType(thisItemInfo) === TYPE_BOOKMARK) {
        urlList.push(thisItemInfo.url)
      }
    }

    const msgAskOpenAll = chrome.i18n.getMessage(
      'askOpenAll', String(urlList.length)
    )

    if (options.warnOpenMany &&
        urlList.length > 5 &&
        !confirm(msgAskOpenAll)) {
      return
    }
  } else {
    const results = await chromep.bookmarks.get(itemInfo.id)

    const thisItemInfo = results[0]

    urlList.push(thisItemInfo.url)
  }

  if (menuItemNum === 0) {
    for (const url of urlList) {
      chrome.tabs.create({
        url,
        active: false
      })
    }
  } else {
    chrome.windows.create({
      url: urlList,
      incognito: menuItemNum !== 1
    })
  }

  window.close()
}

export function openOptionsPage() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage()
  } else {
    chrome.tabs.create({url: 'options.html'})
  }
}

export function resetBodySize() {
  const bodyStyle = document.body.style

  // reset to original size
  bodyStyle.height = ''
  bodyStyle.width = ''
}

export function setPredefinedStyleSheet(styleOptions) {
  const {
    fontFamily,
    fontSize,
    itemHeight,
    itemOffsetHeight,
    panelWidth
  } = styleOptions

  css.set({
    body: {
      font: `${fontSize}px ${fontFamily}`
    },
    '.bookmark-item': {
      height: itemHeight + 'px'
    },
    '.icon': {
      // set the width same as item height, as it is a square
      width: itemHeight + 'px'
    },
    '.panel-width': {
      // set panel (#main, #sub) width
      width: panelWidth + 'px'
    },
    '.separator': {
      // set separator height depend on item height
      height: (itemOffsetHeight / 2) + 'px'
    }
  })
}

export function sortByTitle(bookmarkList) {
  const collator = new Intl.Collator()

  const {compare} = collator

  return bookmarkList.sort((a, b) => compare(a.title, b.title))
}
