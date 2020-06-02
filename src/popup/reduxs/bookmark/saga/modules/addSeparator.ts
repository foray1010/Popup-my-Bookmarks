import { nanoid } from 'nanoid'
import { put } from 'redux-saga/effects'
import type { ActionType } from 'typesafe-actions'

import * as CST from '../../../../constants'
import * as bookmarkCreators from '../../actions'

export function* addSeparator({
  payload,
}: ActionType<typeof bookmarkCreators.addSeparator>) {
  try {
    yield put(
      bookmarkCreators.createBookmark(
        payload.parentId,
        payload.index,
        '- '.repeat(54).trim(),
        // avoid duplicated URL which may be cleaned up by third-party tools
        CST.SEPARATE_THIS_URL + '#' + nanoid(),
      ),
    )
  } catch (err) {
    console.error(err)
  }
}
