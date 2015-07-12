import {element, render, tree} from 'deku'

import App from './_components/popup/app'

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

    if (itemInfo.url === globals.separateThisUrl) {
      return 'separator'
    }

    return 'bookmark'
  },

  getSingleTree(id) {
    return new Promise((resolve) => {
      chrome.bookmarks.get(id, (itemInfo) => {
        chrome.bookmarks.getChildren(id, (childrenInfo) => {
          const treeInfo = itemInfo[0]

          treeInfo.children = childrenInfo

          resolve(treeInfo)
        })
      })
    })
  },

  openMultipleBookmarks(itemInfo, menuItemNum) {
    const urlList = []

    return new Promise((resolve, reject) => {
      if (globals.isFolder(itemInfo)) {
        chrome.bookmarks.getSubTree(itemInfo.id, (results) => {
          const childrenInfo = results[0].children

          childrenInfo.forEach((thisItemInfo) => {
            if (globals.getBookmarkType(thisItemInfo) === 'bookmark') {
              urlList.push(thisItemInfo.url)
            }
          })

          const msgAskOpenAll = chrome.i18n.getMessage(
            'askOpenAll', '' + urlList.length
          )

          if (globals.storage.warnOpenMany &&
              urlList.length > 5 &&
              !confirm(msgAskOpenAll)) {
            reject()
          } else {
            resolve()
          }
        })
      } else {
        chrome.bookmarks.get(itemInfo.id, (results) => {
          const thisItemInfo = results[0]

          urlList.push(thisItemInfo.url)

          resolve()
        })
      }
    })
      .then(() => {
        if (menuItemNum === 0) {
          urlList.forEach((url) => {
            chrome.tabs.create({
              url: url,
              active: false
            })
          })
        } else {
          chrome.windows.create({
            url: urlList,
            incognito: menuItemNum !== 1
          })
        }

        window.close()
      })
  },

  openOptionsPage() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage()
    } else {
      chrome.tabs.create({url: 'options.html'})
    }
  },

  removeTreeInfoFromIndex(trees, removeFromIndex) {
    // clone the array to avoid polluting the prevState value
    const newTrees = trees.slice()

    newTrees.splice(removeFromIndex)

    globals.setRootState({
      trees: newTrees
    })
  },

  sortByTitle(bookmarkList) {
    return bookmarkList.sort((bookmark1, bookmark2) => {
      return bookmark1.title.localeCompare(bookmark2.title)
    })
  }
}

new Promise((resolve) => {
  chrome.storage.sync.get(null, (storage) => {
    globals.storage = storage

    // +2 for border width, goldenGap*2 for padding
    globals.itemHeight = 2 + globals.goldenGap * 2 +
      Math.max(globals.storage.fontSize, 16)

    // if first run
    if (globals.storage.hideRootFolder === undefined) {
      globals.openOptionsPage()
    } else {
      resolve()
    }
  })
})
  .then(() => {
    return globals.getSingleTree('0')
      .then((treeInfo) => {
        treeInfo.children = treeInfo.children.filter((itemInfo) => {
          const itemIdNum = 1 * itemInfo.id

          const isFilterThisItem = (
            itemIdNum === globals.storage.defExpand ||
            globals.storage.hideRootFolder.indexOf(itemIdNum) >= 0
          )

          return !isFilterThisItem
        })

        globals.rootTree = treeInfo
      })
  })
  .then(() => {
    globals.getSingleTree('' + globals.storage.defExpand)
      .then((defExpandTree) => {
        const app = tree(
          <App defExpandTree={defExpandTree} />
        )

        render(app, document.getElementById('container'))
      })
  })
