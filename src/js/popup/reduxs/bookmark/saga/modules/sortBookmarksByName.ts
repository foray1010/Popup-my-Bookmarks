import * as R from 'ramda'
import {SagaIterator} from 'redux-saga'
import {call} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import {moveBookmark} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import {BookmarkInfo, BookmarkTree} from '../../../../types'
import sortByTitle from '../../../../utils/sortByTitle'
import * as bookmarkCreators from '../../actions'
import {getBookmarkInfo, getBookmarkTree} from '../utils/getters'

const groupBySeparator = R.groupWith<BookmarkInfo>(
  R.compose(
    R.not,
    R.propEq('type', CST.BOOKMARK_TYPES.SEPARATOR),
    R.nthArg(1)
  )
)

interface TypeGroup {
  type: CST.BOOKMARK_TYPES
  members: Array<BookmarkInfo>
}
const groupByType = (bookmarkInfos: Array<BookmarkInfo>): Array<TypeGroup> => {
  return bookmarkInfos.reduce((acc: Array<TypeGroup>, bookmarkInfo) => {
    const matchType = (group: TypeGroup) => group.type === bookmarkInfo.type

    if (!acc.some(matchType)) {
      acc.push({
        type: bookmarkInfo.type,
        members: []
      })
    }

    const matchedGroup = acc.find(matchType)
    if (matchedGroup) {
      matchedGroup.members.push(bookmarkInfo)
    }

    return acc
  }, [])
}

const sortGroupByPriority = (groups: Array<TypeGroup>) => {
  const priority = [
    CST.BOOKMARK_TYPES.SEPARATOR,
    CST.BOOKMARK_TYPES.FOLDER,
    CST.BOOKMARK_TYPES.BOOKMARK
  ]
  return Array.from(groups).sort((groupA, groupB) => {
    return priority.indexOf(groupA.type) - priority.indexOf(groupB.type)
  })
}

const ungroup = (nestedGroups: Array<Array<TypeGroup>>): Array<BookmarkInfo> => {
  return nestedGroups.reduce((acc: Array<BookmarkInfo>, nestedGroup) => {
    return acc.concat(
      nestedGroup.reduce((acc2: Array<BookmarkInfo>, group) => acc2.concat(group.members), [])
    )
  }, [])
}

const sortBookmarks = R.compose(
  ungroup,
  R.map(sortGroupByPriority),
  R.map((groups: Array<TypeGroup>) =>
    groups.map((group) => ({
      ...group,
      members: sortByTitle(group.members)
    }))),
  R.map(groupByType),
  groupBySeparator
)

export function* sortBookmarksByName({
  payload
}: ActionType<typeof bookmarkCreators.sortBookmarksByName>): SagaIterator {
  try {
    const bookmarkTree: BookmarkTree = yield call(getBookmarkTree, payload.parentId)

    const sortedBookmarkInfos = sortBookmarks(bookmarkTree.children)

    // Moving bookmarks to sorted index
    for (const [index, bookmarkInfo] of sortedBookmarkInfos.entries()) {
      const currentBookmarkInfo: BookmarkInfo = yield call(getBookmarkInfo, bookmarkInfo.id)
      const currentIndex = currentBookmarkInfo.storageIndex
      if (currentIndex !== index) {
        yield call(moveBookmark, bookmarkInfo.id, {
          // if new index is after current index, need to add 1,
          // because index means the position in current array,
          // which also count the current position
          index: index + (index > currentIndex ? 1 : 0)
        })
      }
    }
  } catch (err) {
    console.error(err)
  }
}
