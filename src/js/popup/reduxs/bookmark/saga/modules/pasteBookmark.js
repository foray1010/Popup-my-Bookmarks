// @flow

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'

import {createBookmark, moveBookmark} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import type {BookmarkInfo, BookmarkNode, BookmarkTree} from '../../../../types'
import {bookmarkCreators} from '../../actions'
import {getBookmarkInfo, getBookmarkTree} from '../utils/getters'

type RecursiveCopyPayload = {|
  fromId: string,
  toIndex: number,
  toParentId: string
|}
function* recursiveCopy({fromId, toIndex, toParentId}: RecursiveCopyPayload) {
  const bookmarkInfo: BookmarkInfo = yield call(getBookmarkInfo, fromId)

  const createdBookmarkNode: BookmarkNode = yield call(createBookmark, {
    index: toIndex,
    parentId: toParentId,
    title: bookmarkInfo.title,
    ...(bookmarkInfo.type !== CST.TYPE_FOLDER ? {url: bookmarkInfo.url} : null)
  })

  if (bookmarkInfo.type === CST.TYPE_FOLDER) {
    const bookmarkTree: BookmarkTree = yield call(getBookmarkTree, fromId)
    for (const [index, child] of bookmarkTree.children.entries()) {
      yield call(recursiveCopy, {
        fromId: child.id,
        toIndex: index,
        toParentId: createdBookmarkNode.id
      })
    }
  }
}

type Payload = {|
  index: number,
  parentId: string
|}
export function* pasteBookmark({parentId, index}: Payload): Saga<void> {
  const {bookmark} = yield select(R.identity)
  const {clipboard} = bookmark

  if (clipboard.isRemoveAfterPaste) {
    yield call(moveBookmark, clipboard.id, {parentId, index})
  } else {
    yield call(recursiveCopy, {
      fromId: clipboard.id,
      toIndex: index,
      toParentId: parentId
    })
  }

  yield put(bookmarkCreators.resetClipboard())
}
