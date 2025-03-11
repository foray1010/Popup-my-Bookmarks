import type { ValueOf } from 'type-fest'
import webExtension from 'webextension-polyfill'

import { BOOKMARK_TYPES } from '../constants.js'
import type { BookmarkInfo } from '../types.js'
import sortByTitle from '../utils/sortByTitle.js'
import { getBookmarkInfo, getBookmarkTreeInfo } from './getBookmark.js'

function splitBySeparator(
  bookmarkInfos: readonly BookmarkInfo[],
): readonly (readonly BookmarkInfo[])[] {
  return bookmarkInfos.reduce<BookmarkInfo[][]>(
    (acc, bookmarkInfo) => {
      if (acc.length === 0 || bookmarkInfo.type === BOOKMARK_TYPES.SEPARATOR) {
        acc.push([])
      }

      acc.at(-1)?.push(bookmarkInfo)

      return acc
    },
    [[]],
  )
}

type BookmarkGroup = Readonly<{
  type: ValueOf<typeof BOOKMARK_TYPES>
  members: readonly BookmarkInfo[]
}>
function groupByType(
  bookmarkInfos: readonly BookmarkInfo[],
): readonly BookmarkGroup[] {
  return bookmarkInfos.reduce<
    Array<
      Readonly<{
        type: ValueOf<typeof BOOKMARK_TYPES>
        members: BookmarkInfo[]
      }>
    >
  >((acc, bookmarkInfo) => {
    const matchType = (group: BookmarkGroup) => group.type === bookmarkInfo.type

    if (!acc.some(matchType)) {
      acc.push({
        type: bookmarkInfo.type,
        members: [],
      })
    }

    const matchedGroup = acc.find(matchType)
    if (matchedGroup) {
      matchedGroup.members.push(bookmarkInfo)
    }

    return acc
  }, [])
}

function sortGroupByPriority(
  groups: readonly BookmarkGroup[],
): readonly BookmarkGroup[] {
  const priority = [
    BOOKMARK_TYPES.SEPARATOR,
    BOOKMARK_TYPES.FOLDER,
    BOOKMARK_TYPES.BOOKMARK,
    // shouldn't exist
    BOOKMARK_TYPES.DRAG_INDICATOR,
    BOOKMARK_TYPES.NO_BOOKMARK,
  ] as const satisfies readonly ValueOf<typeof BOOKMARK_TYPES>[]
  return Array.from(groups).sort((groupA, groupB) => {
    return priority.indexOf(groupA.type) - priority.indexOf(groupB.type)
  })
}

function mergeGroups(
  nestedGroups: readonly (readonly BookmarkGroup[])[],
): readonly BookmarkInfo[] {
  return nestedGroups.flatMap((nestedGroup) =>
    nestedGroup.flatMap((group) => group.members),
  )
}

function sortBookmarks(
  bookmarkInfos: readonly BookmarkInfo[],
): readonly BookmarkInfo[] {
  const nestedGroups = splitBySeparator(bookmarkInfos)
    .map(groupByType)
    .map((groups) => {
      return groups.map((group) => {
        return {
          ...group,
          members: sortByTitle(group.members),
        }
      })
    })
    .map(sortGroupByPriority)
  return mergeGroups(nestedGroups)
}

export default async function sortBookmarksByName(parentId: string) {
  const bookmarkTree = await getBookmarkTreeInfo(parentId)

  const sortedBookmarkInfos = sortBookmarks(bookmarkTree.children)

  // Moving bookmarks to sorted index
  for (const [index, bookmarkInfo] of sortedBookmarkInfos.entries()) {
    const currentBookmarkInfo = await getBookmarkInfo(bookmarkInfo.id)
    const currentIndex = currentBookmarkInfo.storageIndex
    if (currentIndex !== index) {
      await webExtension.bookmarks.move(bookmarkInfo.id, {
        // if new index is after current index, need to add 1,
        // because index means the position in current array,
        // which also count the current position
        index: index + (index > currentIndex ? 1 : 0),
      })
    }
  }
}
