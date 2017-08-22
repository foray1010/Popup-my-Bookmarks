/* @flow */

import R from 'ramda'

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

export async function addCurrentPage(belowTarget: Object): Promise<void> {
  const [currentTab] = await chromep.tabs.query({
    currentWindow: true,
    active: true
  })

  await createBookmarkBelowTarget(belowTarget, currentTab.title, currentTab.url)
}

export async function createBookmarkBelowTarget(
  target: Object,
  title: string,
  url: ?string
): Promise<Object> {
  const createdItemInfo: Object = await chromep.bookmarks.create({
    index: target.index + 1,
    parentId: target.parentId,
    title: title.trim(),
    url: url && url.trim()
  })

  return createdItemInfo
}

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
  const childrenInfoPromise = chromep.bookmarks.getChildren(id)
  const itemInfoPromise = getBookmark(id)

  const childrenInfo = await childrenInfoPromise
  const itemInfo = await itemInfoPromise

  return {
    ...itemInfo,
    children: childrenInfo
  }
}

export function getFocusTargetTreeIndex(
  focusTarget: any, // use `any` because of https://github.com/facebook/flow/issues/52
  trees: Object[]
): number {
  if (!focusTarget) {
    return trees.length - 1
  }

  if (getBookmarkType(focusTarget) === TYPE_ROOT_FOLDER) {
    return 0
  }

  const matchedIndex = trees.findIndex((treeInfo) => treeInfo.id === focusTarget.parentId)

  if (matchedIndex < 0) {
    return trees.length - 1
  }

  return matchedIndex
}

export async function getRootTree(options: Object): Promise<Object> {
  const rootTree: Object = await getFlatTree(ROOT_ID)

  const filteredChildrenInfo = rootTree.children.filter((
    itemInfo: Object
  ): boolean => {
    const itemIdNum: number = Number(itemInfo.id)

    const isFilterThisItem: boolean = (
      itemIdNum === options.defExpand ||
      options.hideRootFolder.includes(itemIdNum)
    )

    return !isFilterThisItem
  })

  return {
    ...rootTree,
    children: filteredChildrenInfo
  }
}

export async function getSearchResult(
  newSearchKeyword: string,
  options: Object
): Promise<Object> {
  const isOnlySearchTitle: boolean = options.searchTarget === 1
  const searchResult: Object[] = await chromep.bookmarks.search(newSearchKeyword)

  const splittedKeyArr: string[] = isOnlySearchTitle ?
    newSearchKeyword.split(' ').map((x) => x.toLowerCase()) : []

  const filteredResult: Object[] = searchResult
    .filter((itemInfo: Object) => getBookmarkType(itemInfo) === TYPE_BOOKMARK)
    .reduce((acc: Object[], itemInfo: Object) => {
      if (acc.length === options.maxResults) return acc

      if (isOnlySearchTitle) {
        const itemTitle: string = itemInfo.title.toLowerCase()

        const isTitleMatched: boolean = splittedKeyArr
          .every((x: string): boolean => itemTitle.includes(x))

        if (!isTitleMatched) return acc
      }

      return acc.concat(itemInfo)
    }, [])

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
        console.warn(err.stack)
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
      case 1: // current tab (without closing PmB)
        await chromep.tabs.update({url: itemUrl})
        break

      case 2: // new tab
      case 3: // background tab
      case 4: // background tab (without closing PmB)
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
    case 1: // current tab (without closing PmB)
    case 4: // background tab (without closing PmB)
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
    isNewWindow?: boolean,
    isIncognito?: boolean,
    isWarnWhenOpenMany?: boolean
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

export async function pasteItemBelowTarget(
  fromTarget: Object,
  belowTarget: Object,
  isCut: boolean
): Promise<void> {
  if (isCut) {
    await chromep.bookmarks.move(fromTarget.id, {
      parentId: belowTarget.parentId,
      index: belowTarget.index + 1
    })
  } else {
    const copyChildrenIfFolder = async (
      thisTreeInfo: Object,
      parentId: string
    ): Promise<void> => {
      if (isFolder(thisTreeInfo)) {
        for (const thisItemInfo of thisTreeInfo.children) {
          const thisCreatedItemInfo = await chromep.bookmarks.create({
            parentId: parentId,
            title: thisItemInfo.title,
            url: thisItemInfo.url
          })

          await copyChildrenIfFolder(thisItemInfo, thisCreatedItemInfo.id)
        }
      }
    }

    const [treeInfo] = await chromep.bookmarks.getSubTree(fromTarget.id)

    const createdItemInfo = await createBookmarkBelowTarget(
      belowTarget,
      treeInfo.title,
      treeInfo.url
    )

    await copyChildrenIfFolder(treeInfo, createdItemInfo.id)
  }
}

export async function removeBookmark(target: Object): Promise<void> {
  if (isFolder(target)) {
    await chromep.bookmarks.removeTree(target.id)
  } else {
    await chromep.bookmarks.remove(target.id)
  }
}

export async function sortByName(parentId: string): Promise<void> {
  const childrenInfo: Object[] = await chromep.bookmarks.getChildren(parentId)

  const genClassifiedItems = (): Array<Object[]> => ([
    [/* Separators */],
    [/* Folders */],
    [/* Bookmarks */]
  ])
  const getClassifiedItemIndex = (itemInfo): number => {
    switch (getBookmarkType(itemInfo)) {
      case TYPE_SEPARATOR:
        return 0

      case TYPE_FOLDER:
        return 1

      case TYPE_BOOKMARK:
      default:
        return 2
    }
  }

  /**
   * Split all bookmarks into n main group,
   * where n = the number of separators + 1
   * Each main group contains 3 small groups
   * [Separators, Folders, Bookmarks]
   */
  const classifiedItemsList: Array<Array<Object[]>> = childrenInfo
    .reduce((accumulator, itemInfo) => {
      const classifiedItemIndex = getClassifiedItemIndex(itemInfo)

      if (accumulator.length === 0 || classifiedItemIndex === 0) {
        accumulator.push(genClassifiedItems())
      }

      const lastClassifiedItems = R.last(accumulator)

      lastClassifiedItems[classifiedItemIndex].push(itemInfo)

      return accumulator
    }, [])

  // Sort and concatenate all lists into single list
  const sortedChildrenInfo: Object[] = R.compose(
    R.flatten,
    R.map((classifiedItems) => classifiedItems.map(sortByTitle))
  )(classifiedItemsList)

  // Moving bookmarks to sorted index
  for (const [
    index: number,
    itemInfo: Object
  ] of sortedChildrenInfo.entries()) {
    const oldItemInfo = await getBookmark(itemInfo.id)

    const oldIndex: number = oldItemInfo.index

    if (oldIndex !== index) {
      await chromep.bookmarks.move(itemInfo.id, {
        // if new index is after old index, need to add 1,
        // because index means the position in current array,
        // which also count the current position
        index: index + (index > oldIndex ? 1 : 0)
      })
    }
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
