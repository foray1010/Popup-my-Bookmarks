/* @flow */

import {
  lastUsedTreeIdsStorage
} from './lastPosition'
import {
  ROOT_ID,
  SEPARATE_THIS_URL,
  TYPE_BOOKMARK,
  TYPE_FOLDER,
  TYPE_NO_BOOKMARK,
  TYPE_ROOT_FOLDER,
  TYPE_SEPARATOR
} from '../constants'
import chromep from '../../common/lib/chromePromise'

const msgNoBookmark: string = window.chrome.i18n.getMessage('noBkmark')
const noBookmarkIdPrefix: string = 'no-bookmark-'

export function genBookmarkList(
  treeInfo: Object,
  {
    isSearching,
    rootTree,
    treeIndex
  }: {
    isSearching: boolean,
    rootTree: Object,
    treeIndex: number
  }
): Object[] {
  let childrenInfo: Object[] = treeInfo.children

  if (!isSearching) {
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

export function genDummyItemInfo(): Object {
  return {
    dateAdded: null,
    dateGroupModified: null,
    id: null,
    index: null,
    parentId: null,
    title: null
  }
}

function genNoBookmarkInfo(parentId: string): Object {
  return {
    ...genDummyItemInfo(),
    id: `${noBookmarkIdPrefix}${parentId}`,
    index: -1, // as it is not appeared in the childrenInfo
    parentId: parentId,
    title: msgNoBookmark
  }
}

export async function getBookmark(id: string): Promise<Object> {
  const [itemInfo] = await chromep.bookmarks.get(id)
  return itemInfo
}

export function getBookmarkType(itemInfo: Object): string {
  if (RegExp(`^${noBookmarkIdPrefix}`).test(itemInfo.id)) {
    return TYPE_NO_BOOKMARK
  }

  if (itemInfo.parentId === ROOT_ID) {
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

export async function getFlatTree(id: string): Promise<Object> {
  const treeInfo: Object = await getBookmark(id)

  treeInfo.children = await chromep.bookmarks.getChildren(id)

  return treeInfo
}

export async function getRootTree(options: Object): Promise<Object> {
  const rootTree: Object = await getFlatTree(ROOT_ID)

  rootTree.children = rootTree.children.filter((
    itemInfo: Object
  ): boolean => {
    const itemIdNum: number = Number(itemInfo.id)

    const isFilterThisItem: boolean = (
      itemIdNum === options.defExpand ||
      options.hideRootFolder.includes(itemIdNum)
    )

    return !isFilterThisItem
  })

  return rootTree
}

export async function getSearchResult(
  newSearchKeyword: string,
  options: Object
): Promise<Object> {
  const filteredResult: Object[] = []
  const isOnlySearchTitle: boolean = options.searchTarget === 1
  const results: Object[] = await chromep.bookmarks.search(newSearchKeyword)
  const splittedKeyArr: string[] = []

  if (isOnlySearchTitle) {
    splittedKeyArr.push(
      ...newSearchKeyword.split(' ').map((x) => x.toLowerCase())
    )
  }

  for (const itemInfo: Object of results) {
    if (getBookmarkType(itemInfo) === TYPE_BOOKMARK) {
      if (isOnlySearchTitle) {
        const itemTitle: string = itemInfo.title.toLowerCase()

        const isTitleMatched: boolean = splittedKeyArr
          .every((x: string): boolean => itemTitle.includes(x))

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

export function getSlicedTrees(
  trees: Object[],
  removeFromIndex: number
): Object[] {
  if (trees.length > removeFromIndex) {
    return trees.slice(0, removeFromIndex)
  }

  return trees
}

export async function initTrees(options: Object): Promise<Object[]> {
  const defaultExpandFolderId: string = String(options.defExpand)

  const firstTree: Object = await getFlatTree(defaultExpandFolderId)

  if (options.rememberPos) {
    const lastUsedTreeIds: string[] = lastUsedTreeIdsStorage.get()

    // the target is to open the last existing folder in lastUsedTreeIds
    // so we get the last existing item first and get all its parent
    // it can prevent bugs when user rearrange bookmarks location without updating lastUsedTreeIds
    let lastExistingTree: ?Object
    for (let i = lastUsedTreeIds.length - 1; i >= 0; i -= 1) {
      // we already have firstTree
      if (lastUsedTreeIds[i] === defaultExpandFolderId) break

      try {
        lastExistingTree = await getFlatTree(lastUsedTreeIds[i])
      } catch (err) {
        // if it does not exist, we don't care
        console.error(err.stack)
      }

      if (lastExistingTree) break
    }

    if (lastExistingTree) {
      const trees: Object[] = []

      let parentId: string = lastExistingTree.parentId
      while (
        parentId &&
        parentId !== ROOT_ID &&
        parentId !== defaultExpandFolderId
      ) {
        const tree: Object = await getFlatTree(parentId)
        trees.unshift(tree)

        parentId = tree.parentId
      }

      trees.unshift(firstTree)
      trees.push(lastExistingTree)

      return trees
    }
  }

  return [firstTree]
}

export function isFolder(itemInfo: Object): boolean {
  const bookmarkType = getBookmarkType(itemInfo)

  return bookmarkType.includes(TYPE_FOLDER)
}

export function isFolderOpened(
  trees: Object[],
  itemInfo: Object
): boolean {
  return trees.some((treeInfo: Object): boolean => treeInfo.id === itemInfo.id)
}

export async function openBookmark(
  itemInfo: Object,
  clickType: string,
  options: Object
): Promise<void> {
  const itemUrl: string = itemInfo.url
  const openMethod: number = options[clickType]

  if (itemUrl.startsWith('javascript:')) {
    await chromep.tabs.executeScript(null, {code: itemUrl})
  } else {
    switch (openMethod) {
      case 0: // current tab
      case 1: // current tab (w/o closing PmB)
        await chromep.tabs.update({url: itemUrl})
        break

      case 2: // new tab
      case 3: // background tab
      case 4: // background tab (w/o closing PmB)
        await chromep.tabs.create({
          url: itemUrl,
          active: openMethod === 2
        })
        break

      case 5: // new window
      case 6: // incognito window
        await chromep.windows.create({
          url: itemUrl,
          incognito: openMethod === 6
        })
        break

      default:
    }
  }

  switch (openMethod) {
    case 1: // current tab (w/o closing PmB)
    case 4: // background tab (w/o closing PmB)
      break

    default:
      window.close()
  }
}

export async function openMultipleBookmarks(
  itemInfo: Object,
  {
    isNewWindow = false,
    isIncognito = false,
    isWarnWhenOpenMany = false
  }: {
    isNewWindow: boolean,
    isIncognito: boolean,
    isWarnWhenOpenMany: boolean
  }
): Promise<void> {
  const urlList: string[] = []

  if (isFolder(itemInfo)) {
    const [treeInfo] = await chromep.bookmarks.getSubTree(itemInfo.id)

    const childrenInfo: Object = treeInfo.children

    for (const thisItemInfo of childrenInfo) {
      if (getBookmarkType(thisItemInfo) === TYPE_BOOKMARK) {
        urlList.push(thisItemInfo.url)
      }
    }

    if (isWarnWhenOpenMany) {
      const msgAskOpenAll: string = window.chrome.i18n.getMessage('askOpenAll')
        .replace('%bkmarkCount%', urlList.length)

      if (urlList.length > 5 && !window.confirm(msgAskOpenAll)) {
        return
      }
    }
  } else {
    const thisItemInfo: Object = await getBookmark(itemInfo.id)

    urlList.push(thisItemInfo.url)
  }

  if (!isNewWindow) {
    await Promise.all(
      urlList.map((url: string): Promise<Object> => {
        return chromep.tabs.create({
          url,
          active: false
        })
      })
    )
  } else {
    await chromep.windows.create({
      url: urlList,
      incognito: isIncognito
    })
  }

  window.close()
}

export async function removeBookmark(target: Object): Promise<void> {
  if (isFolder(target)) {
    await chromep.bookmarks.removeTree(target.id)
  } else {
    await chromep.bookmarks.remove(target.id)
  }
}

export function sortByTitle(bookmarkList: Object[]): Object[] {
  const {
    compare
  }: {
    compare: Function
  } = new window.Intl.Collator()

  return bookmarkList.sort((a, b) => compare(a.title, b.title))
}
