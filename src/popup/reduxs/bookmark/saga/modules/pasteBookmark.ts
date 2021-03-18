import * as R from 'ramda'
import type { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import type { ActionType } from 'typesafe-actions'

import { createBookmark, moveBookmark } from '../../../../../core/utils'
import * as CST from '../../../../constants'
import type { BookmarkInfo, BookmarkTree } from '../../../../types'
import type { RootState } from '../../../rootReducer'
import * as bookmarkCreators from '../../actions'
import { getBookmarkInfo, getBookmarkTree } from '../utils/getters'

interface RecursiveCopyPayload {
  fromId: string
  toIndex: number
  toParentId: string
}
function* recursiveCopy({
  fromId,
  toIndex,
  toParentId,
}: RecursiveCopyPayload): SagaIterator<void> {
  try {
    const bookmarkInfo: BookmarkInfo = yield call(getBookmarkInfo, fromId)

    const createdBookmarkNode: browser.bookmarks.BookmarkTreeNode = yield call(
      createBookmark,
      {
        index: toIndex,
        parentId: toParentId,
        title: bookmarkInfo.title,
        ...(bookmarkInfo.type !== CST.BOOKMARK_TYPES.FOLDER
          ? { url: bookmarkInfo.url }
          : null),
      },
    )

    if (bookmarkInfo.type === CST.BOOKMARK_TYPES.FOLDER) {
      const bookmarkTree: BookmarkTree = yield call(getBookmarkTree, fromId)
      for (const [index, child] of bookmarkTree.children.entries()) {
        yield call(recursiveCopy, {
          fromId: child.id,
          toIndex: index,
          toParentId: createdBookmarkNode.id,
        })
      }
    }
  } catch (err: unknown) {
    console.error(err)
  }
}

export function* pasteBookmark({
  payload,
}: ActionType<typeof bookmarkCreators.pasteBookmark>) {
  try {
    const { bookmark }: RootState = yield select(R.identity)
    const { clipboard } = bookmark

    if (!clipboard.id) return

    if (clipboard.isRemoveAfterPaste) {
      yield call(moveBookmark, clipboard.id, {
        parentId: payload.parentId,
        index: payload.index,
      })
    } else {
      yield call(recursiveCopy, {
        fromId: clipboard.id,
        toIndex: payload.index,
        toParentId: payload.parentId,
      })
    }

    yield put(bookmarkCreators.resetClipboard())
  } catch (err: unknown) {
    console.error(err)
  }
}
