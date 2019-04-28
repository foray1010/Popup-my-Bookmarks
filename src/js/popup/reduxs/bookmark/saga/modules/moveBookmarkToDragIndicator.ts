import * as R from 'ramda'
import {SagaIterator} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import {moveBookmark} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import {BookmarkInfo, BookmarkTree} from '../../../../types'
import {RootState} from '../../../rootReducer'
import * as bookmarkCreators from '../../actions'

const isDragIndicator = (bookmarkInfo: BookmarkInfo) =>
  bookmarkInfo.type === CST.BOOKMARK_TYPES.DRAG_INDICATOR

export function* moveBookmarkToDragIndicator({
  payload
}: ActionType<typeof bookmarkCreators.moveBookmarkToDragIndicator>): SagaIterator {
  try {
    const {bookmark}: RootState = yield select(R.identity)

    const treeInfo: BookmarkTree | void = bookmark.trees.find((tree: BookmarkTree) =>
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
  } catch (err) {
    console.error(err)
  }
}
