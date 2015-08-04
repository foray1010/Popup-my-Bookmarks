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

  getFlatTree(id) {
    let treeInfo

    return chromep.bookmarks.get(id)
      .then((results) => {
        treeInfo = results[0]

        return chromep.bookmarks.getChildren(id)
      })
      .then((childrenInfo) => {
        treeInfo.children = childrenInfo

        return treeInfo
      })
  },

  openMultipleBookmarks(itemInfo, menuItemNum) {
    const urlList = []

    return new Promise((resolve, reject) => {
      if (globals.isFolder(itemInfo)) {
        chromep.bookmarks.getSubTree(itemInfo.id).then((results) => {
          const childrenInfo = results[0].children

          forEach(childrenInfo, (thisItemInfo) => {
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
        chromep.bookmarks.get(itemInfo.id).then((results) => {
          const thisItemInfo = results[0]

          urlList.push(thisItemInfo.url)

          resolve()
        })
      }
    })
      .then(() => {
        if (menuItemNum === 0) {
          forEach(urlList, (url) => {
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
    if (trees.length > removeFromIndex) {
      const newTrees = trees.asMutable()

      newTrees.splice(removeFromIndex)

      globals.setRootState({
        trees: Immutable(newTrees)
      })
    }
  },

  sortByTitle(bookmarkList) {
    return bookmarkList.sort((bookmark1, bookmark2) => {
      return bookmark1.title.localeCompare(bookmark2.title)
    })
  }
}
