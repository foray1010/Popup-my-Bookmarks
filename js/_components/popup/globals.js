import chromep from '../lib/chromePromise'

window.globals = {
  goldenGap: 2,
  maxHeight: 596,
  separateThisUrl: 'http://separatethis.com/',

  isFolder(itemInfo) {
    const bookmarkType = globals.getBookmarkType(itemInfo)

    return /folder$/.test(bookmarkType)
  },

  isFolderOpened(trees, itemInfo) {
    return trees.some((treeInfo) => treeInfo.id === itemInfo.id)
  },

  isItemInView(item) {
    const itemBottomOffsetTop = item.offsetTop + item.offsetHeight
    const itemParent = item.parentNode

    const parentScrollTop = itemParent.scrollTop

    return (
      itemBottomOffsetTop > parentScrollTop &&
      itemParent.offsetHeight + parentScrollTop >= itemBottomOffsetTop
    )
  },

  getBookmarkType(itemInfo) {
    if (/^no-bookmark/.test(itemInfo.id)) {
      return 'no-bookmark'
    }

    if (itemInfo.parentId === '0') {
      return 'root-folder'
    }

    if (!itemInfo.url) {
      return 'folder'
    }

    if (itemInfo.url.startsWith(globals.separateThisUrl)) {
      return 'separator'
    }

    return 'bookmark'
  },

  async getFlatTree(id) {
    const treeInfo = (await chromep.bookmarks.get(id))[0]

    treeInfo.children = await chromep.bookmarks.getChildren(id)

    return treeInfo
  },

  async getFirstTree(options) {
    const firstTree = await globals.getFlatTree(String(options.defExpand))

    return firstTree
  },

  getSlicedTrees(trees, removeFromIndex) {
    if (trees.length > removeFromIndex) {
      return trees.slice(0, removeFromIndex)
    }

    return trees
  },

  async openMultipleBookmarks(model, itemInfo, menuItemNum) {
    const {context} = model

    const urlList = []

    if (globals.isFolder(itemInfo)) {
      const results = await chromep.bookmarks.getSubTree(itemInfo.id)

      const childrenInfo = results[0].children

      for (const thisItemInfo of childrenInfo) {
        if (globals.getBookmarkType(thisItemInfo) === 'bookmark') {
          urlList.push(thisItemInfo.url)
        }
      }

      const msgAskOpenAll = chrome.i18n.getMessage(
        'askOpenAll', String(urlList.length)
      )

      if (context.options.warnOpenMany &&
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
  },

  openOptionsPage() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage()
    } else {
      chrome.tabs.create({url: 'options.html'})
    }
  },

  resetBodySize() {
    const bodyStyle = document.body.style

    // reset to original size
    bodyStyle.height = ''
    bodyStyle.width = ''
  },

  sortByTitle(bookmarkList) {
    const collator = new Intl.Collator()

    const {compare} = collator

    return bookmarkList.sort((a, b) => compare(a.title, b.title))
  }
}
