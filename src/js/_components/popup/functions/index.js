import Immutable from 'seamless-immutable'

import {
  GOLDEN_GAP,
  SEPARATE_THIS_URL,
  TYPE_BOOKMARK,
  TYPE_FOLDER,
  TYPE_NO_BOOKMARK,
  TYPE_ROOT_FOLDER,
  TYPE_SEPARATOR
} from '../constants'
import chromep from '../../lib/chromePromise'
import css from '../../lib/css'

const msgNoBookmark = chrome.i18n.getMessage('noBkmark')

export function genBookmarkList(treeInfo, treeIndex) {
  const {
    rootTree,
    searchKeyword
  } = this.props

  let childrenInfo = treeInfo.children

  if (!searchKeyword) {
    if (childrenInfo.length === 0) {
      childrenInfo = childrenInfo.concat([
        genNoBookmarkInfo(treeInfo.id)
      ])
    }

    if (treeIndex === 0) {
      return rootTree.children.concat(childrenInfo)
    }
  }

  return childrenInfo
}

export function genDummyItemInfo() {
  return {
    dateAdded: null,
    dateGroupModified: null,
    id: null,
    index: null,
    parentId: null,
    title: null
  }
}

export function genNoBookmarkInfo(parentId) {
  return Immutable({
    ...genDummyItemInfo(),
    id: `no-bookmark-${parentId}`,
    index: -1, // as it is not appeared in the childrenInfo
    parentId: parentId,
    title: msgNoBookmark
  })
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

export async function getSearchResult(newSearchKeyword) {
  const {options} = this.props

  const filteredResult = []
  const isOnlySearchTitle = options.searchTarget === 1
  const results = await chromep.bookmarks.search(newSearchKeyword)
  const splittedKeyArr = []

  if (isOnlySearchTitle) {
    splittedKeyArr.push(
      ...newSearchKeyword.split(' ').map((x) => x.toLowerCase())
    )
  }

  for (const itemInfo of results) {
    if (getBookmarkType(itemInfo) === TYPE_BOOKMARK) {
      if (isOnlySearchTitle) {
        const itemTitle = itemInfo.title.toLowerCase()

        const isTitleMatched = splittedKeyArr.every((x) => itemTitle.includes(x))

        if (!isTitleMatched) {
          continue
        }
      }

      filteredResult.push(itemInfo)

      if (filteredResult.length === options.maxResults) {
        break
      }
    }
  }

  return {
    ...genDummyItemInfo(),
    children: sortByTitle(filteredResult),
    id: 'search-result'
  }
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

      if (x.includes(' ')) {
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

  return bookmarkType.includes(TYPE_FOLDER)
}

export function isFolderOpened(trees, itemInfo) {
  return trees.some((treeInfo) => treeInfo.id === itemInfo.id)
}

export async function openMultipleBookmarks(itemInfo, menuItemNum) {
  const {options} = this.props

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
        !window.confirm(msgAskOpenAll)) {
      return
    }
  } else {
    const results = await chromep.bookmarks.get(itemInfo.id)

    const thisItemInfo = results[0]

    urlList.push(thisItemInfo.url)
  }

  if (menuItemNum === 0) {
    await Promise.all(urlList.map((url) => {
      return chromep.tabs.create({
        url,
        active: false
      })
    }))
  } else {
    await chromep.windows.create({
      url: urlList,
      incognito: menuItemNum !== 1
    })
  }

  window.close()
}

export async function openOptionsPage() {
  if (chromep.runtime.openOptionsPage) {
    await chromep.runtime.openOptionsPage()
  } else {
    const manifest = chrome.runtime.getManifest()

    await chromep.tabs.create({
      url: manifest.options_page
    })
  }
}

export function resetBodySize() {
  const bodyStyle = document.body.style

  // reset to original size
  bodyStyle.height = ''
  bodyStyle.width = ''
}

export function scrollIntoViewIfNeeded(el) {
  const {
    bottom,
    top
  } = el.getBoundingClientRect()

  const {
    height: parentHeight,
    top: parentTop
  } = el.parentNode.getBoundingClientRect()

  const isScrolledOutOfBottomView = bottom > parentTop + parentHeight
  const isScrolledOutOfTopView = top < parentTop

  if (isScrolledOutOfBottomView || isScrolledOutOfTopView) {
    el.scrollIntoView(isScrolledOutOfTopView)
  }
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
  const {compare} = new window.Intl.Collator()

  return bookmarkList.sort((a, b) => compare(a.title, b.title))
}
