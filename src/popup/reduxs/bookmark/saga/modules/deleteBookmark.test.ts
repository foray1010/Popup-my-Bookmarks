/* eslint redux-saga/no-unhandled-errors: 'off' */

import Chance from 'chance'
import { call } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import { removeBookmark, removeBookmarkTree } from '../../../../../core/utils'
import * as CST from '../../../../constants'
import * as bookmarkCreators from '../../actions'
import bookmarkTrees from '../__fixtures__/bookmarkTrees'
import { getBookmarkInfo } from '../utils/getters'
import { deleteBookmark } from './deleteBookmark'

const chance = Chance('deleteBookmark')

describe('deleteBookmark', () => {
  const id = String(chance.integer())
  let generator = deleteBookmark({
    type: getType(bookmarkCreators.deleteBookmark),
    payload: { id },
  })

  beforeEach(() => {
    generator = deleteBookmark({
      type: getType(bookmarkCreators.deleteBookmark),
      payload: { id },
    })
  })

  test('should delete bookmark', () => {
    expect(generator.next().value).toEqual(call(getBookmarkInfo, id))

    const bookmarkInfo = {
      ...bookmarkTrees[0].children[0],
      type: CST.BOOKMARK_TYPES.BOOKMARK,
    }
    expect(generator.next(bookmarkInfo).value).toEqual(call(removeBookmark, id))

    expect(generator.next().done).toBe(true)
  })

  test('should delete folder recursively', () => {
    expect(generator.next().value).toEqual(call(getBookmarkInfo, id))

    const bookmarkInfo = {
      ...bookmarkTrees[0].children[0],
      type: CST.BOOKMARK_TYPES.FOLDER,
    }
    expect(generator.next(bookmarkInfo).value).toEqual(
      call(removeBookmarkTree, id),
    )

    expect(generator.next().done).toBe(true)
  })
})
