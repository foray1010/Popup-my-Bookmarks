import { call } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'

import { moveBookmark } from '../../../../../core/utils'
import * as CST from '../../../../constants'
import { BookmarkInfo, BookmarkTree } from '../../../../types'
import sortByTitle from '../../../../utils/sortByTitle'
import * as bookmarkCreators from '../../actions'
import { getBookmarkInfo, getBookmarkTree } from '../utils/getters'

const splitBySeparator = (bookmarkInfos: BookmarkInfo[]): BookmarkInfo[][] => {
  return bookmarkInfos.reduce(
    (acc: BookmarkInfo[][], bookmarkInfo) => {
      if (
        acc.length === 0 ||
        bookmarkInfo.type === CST.BOOKMARK_TYPES.SEPARATOR
      ) {
        acc.push([])
      }

      acc[acc.length - 1].push(bookmarkInfo)

      return acc
    },
    [[]],
  )
}

interface BookmarkGroup {
  type: CST.BOOKMARK_TYPES
  members: BookmarkInfo[]
}
const groupByType = (bookmarkInfos: BookmarkInfo[]): BookmarkGroup[] => {
  return bookmarkInfos.reduce((acc: BookmarkGroup[], bookmarkInfo) => {
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

const sortGroupByPriority = (groups: BookmarkGroup[]): BookmarkGroup[] => {
  const priority = [
    CST.BOOKMARK_TYPES.SEPARATOR,
    CST.BOOKMARK_TYPES.FOLDER,
    CST.BOOKMARK_TYPES.BOOKMARK,
  ]
  return Array.from(groups).sort((groupA, groupB) => {
    return priority.indexOf(groupA.type) - priority.indexOf(groupB.type)
  })
}

const mergeGroups = (nestedGroups: BookmarkGroup[][]): BookmarkInfo[] => {
  return nestedGroups
    .map(nestedGroup => nestedGroup.map(group => group.members).flat())
    .flat()
}

const sortBookmarks = (bookmarkInfos: BookmarkInfo[]): BookmarkInfo[] => {
  const nestedGroups = splitBySeparator(bookmarkInfos)
    .map(groupByType)
    .map(groups => {
      return groups.map(group => ({
        ...group,
        members: sortByTitle(group.members),
      }))
    })
    .map(sortGroupByPriority)
  return mergeGroups(nestedGroups)
}

export function* sortBookmarksByName({
  payload,
}: ActionType<typeof bookmarkCreators.sortBookmarksByName>) {
  try {
    const bookmarkTree: BookmarkTree = yield call(
      getBookmarkTree,
      payload.parentId,
    )

    const sortedBookmarkInfos = sortBookmarks(bookmarkTree.children)

    // Moving bookmarks to sorted index
    for (const [index, bookmarkInfo] of sortedBookmarkInfos.entries()) {
      const currentBookmarkInfo: BookmarkInfo = yield call(
        getBookmarkInfo,
        bookmarkInfo.id,
      )
      const currentIndex = currentBookmarkInfo.storageIndex
      if (currentIndex !== index) {
        yield call(moveBookmark, bookmarkInfo.id, {
          // if new index is after current index, need to add 1,
          // because index means the position in current array,
          // which also count the current position
          index: index + (index > currentIndex ? 1 : 0),
        })
      }
    }
  } catch (err) {
    console.error(err)
  }
}
