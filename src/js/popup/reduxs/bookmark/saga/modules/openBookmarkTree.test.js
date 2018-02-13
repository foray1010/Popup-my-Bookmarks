import Chance from 'chance'
import {call, put} from 'redux-saga/effects'

import {bookmarkCreators} from '../../actions'
import bookmarkTrees from '../__fixtures__/bookmarkTrees'
import {getBookmarkTree} from '../utils/getters'
import {openBookmarkTree} from './openBookmarkTree'

const chance = new Chance('openBookmarkTree')

const fakedId = String(chance.integer())
const fakedIndex = chance.integer()

describe('openBookmarkTree', () => {
  test('get bookmark trees by `id` and replace bookmark trees starting from `index`', () => {
    const generator = openBookmarkTree({
      id: fakedId,
      index: fakedIndex
    })

    expect(generator.next().value).toEqual(call(getBookmarkTree, fakedId))

    expect(generator.next(bookmarkTrees[0]).value).toEqual(
      put(bookmarkCreators.spliceBookmarkTrees(fakedIndex, [bookmarkTrees[0]]))
    )

    expect(generator.next().done).toBe(true)
  })
})
