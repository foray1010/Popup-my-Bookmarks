/* eslint redux-saga/no-unhandled-errors: 'off' */

import { all, call, put, select } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import bookmarkTrees, {
  generateBookmarkTree,
} from '../__fixtures__/bookmarkTrees'
import * as bookmarkCreators from '../../actions'
import { getBookmarkTree } from '../utils/getters'
import { bookmarkTreesSelector, openBookmarkTree } from './openBookmarkTree'

describe('openBookmarkTree', () => {
  test('get bookmark trees by `id` and replace bookmark trees after `parentId`', () => {
    const fakeBookmarkTree = generateBookmarkTree()
    fakeBookmarkTree.parent.parentId = bookmarkTrees[3].parent.id

    const { id, parentId } = fakeBookmarkTree.parent

    const generator = openBookmarkTree({
      type: getType(bookmarkCreators.openBookmarkTree),
      payload: {
        id,
        parentId,
      },
    })

    expect(generator.next().value).toEqual(
      all([select(bookmarkTreesSelector), call(getBookmarkTree, id)]),
    )

    expect(generator.next([bookmarkTrees, fakeBookmarkTree]).value).toEqual(
      put(
        bookmarkCreators.setBookmarkTrees([
          ...bookmarkTrees.slice(0, 4),
          fakeBookmarkTree,
        ]),
      ),
    )

    expect(generator.next().done).toBe(true)
  })
  test('skip if `id` already exist in current trees', () => {
    const { id, parentId } = bookmarkTrees[0].parent

    const generator = openBookmarkTree({
      type: getType(bookmarkCreators.openBookmarkTree),
      payload: {
        id,
        parentId,
      },
    })

    expect(generator.next().value).toEqual(
      all([select(bookmarkTreesSelector), call(getBookmarkTree, id)]),
    )

    expect(generator.next([bookmarkTrees, bookmarkTrees[0]]).done).toBe(true)
  })
  test('skip if `parentId` is not exist in current trees', () => {
    const fakeBookmarkTree = generateBookmarkTree()
    fakeBookmarkTree.parent.parentId = 'NOT_EXIST'

    const { id, parentId } = fakeBookmarkTree.parent

    const generator = openBookmarkTree({
      type: getType(bookmarkCreators.openBookmarkTree),
      payload: {
        id,
        parentId,
      },
    })

    expect(generator.next().value).toEqual(
      all([select(bookmarkTreesSelector), call(getBookmarkTree, id)]),
    )

    expect(generator.next([bookmarkTrees, fakeBookmarkTree]).done).toBe(true)
  })
})
