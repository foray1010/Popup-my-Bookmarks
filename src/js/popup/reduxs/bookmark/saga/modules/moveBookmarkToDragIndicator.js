// @flow strict

import * as R from 'ramda'
import type {ActionType} from 'redux-actions'
import type {Saga} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'

import {moveBookmark} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import type {BookmarkInfo, BookmarkTree} from '../../../../types'
import {bookmarkCreators} from '../../actions'

const isDragIndicator = (bookmarkInfo: BookmarkInfo) =>
  bookmarkInfo.type === CST.TYPE_DRAG_INDICATOR

export function* moveBookmarkToDragIndicator({
  payload
}: ActionType<typeof bookmarkCreators.moveBookmarkToDragIndicator>): Saga<void> {
  const {bookmark} = yield select(R.identity)

  const treeInfo: ?BookmarkTree = bookmark.trees.find((tree) =>
    tree.children.some(isDragIndicator))
  if (!treeInfo) return

  const {storageIndex} = treeInfo.children.reduceRight(
    (acc, bookmarkInfo) => {
      if (acc.isReduced) return acc

      if (isDragIndicator(bookmarkInfo)) {
        return {
          ...acc,
          isCapture: true
        }
      }

      if (acc.isCapture) {
        if (!bookmarkInfo.isRoot && !bookmarkInfo.isSimulated) {
          return {
            isCapture: false,
            isReduced: true,
            storageIndex: bookmarkInfo.storageIndex + 1
          }
        }
      }

      return acc
    },
    {
      isCapture: false,
      isReduced: false,
      storageIndex: 0
    }
  )

  yield call(moveBookmark, payload.bookmarkId, {
    parentId: treeInfo.parent.id,
    index: storageIndex
  })

  yield put(bookmarkCreators.removeDragIndicator())
}
