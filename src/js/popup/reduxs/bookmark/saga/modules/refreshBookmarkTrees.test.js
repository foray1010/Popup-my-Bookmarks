import Chance from 'chance'
import {call, put, select} from 'redux-saga/effects'

import {bookmarkCreators} from '../../actions'
import bookmarkTrees from '../__fixtures__/bookmarkTrees'
import {getBookmarkTrees} from '../utils/getters'
import {getTailTreeIds, refreshBookmarkTrees} from './refreshBookmarkTrees'

const chance = new Chance('refreshBookmarkTrees')

const getTailTreeIdsResult = [
  '8659',
  '3490',
  '6906',
  '5605',
  '2976',
  '5492',
  '3540',
  '4091',
  '5759'
]

describe('getTailTreeIds', () => {
  test('get all tree ids except first tree', () => {
    expect(getTailTreeIds(bookmarkTrees)).toEqual(getTailTreeIdsResult)
  })

  test('allow empty array', () => {
    expect(getTailTreeIds([])).toEqual([])
  })
})

describe('refreshBookmarkTrees', () => {
  test('get search result if search keyword is not empty', () => {
    const generator = refreshBookmarkTrees()

    expect(generator.next().value).toEqual(select())

    const searchKeyword = chance.word()
    expect(
      generator.next({
        bookmark: {searchKeyword}
      }).value
    ).toEqual(put(bookmarkCreators.getSearchResult(searchKeyword)))

    expect(generator.next().done).toBe(true)
  })

  test('get updated bookmark trees if search keyword is empty', () => {
    const generator = refreshBookmarkTrees()

    expect(generator.next().value).toEqual(select())

    const options = {
      fakeKey: chance.word()
    }
    const searchKeyword = ''
    expect(
      generator.next({
        bookmark: {
          searchKeyword,
          trees: bookmarkTrees
        },
        options
      }).value
    ).toEqual(call(getBookmarkTrees, getTailTreeIdsResult, options))

    const updatedBookmarkTrees = [bookmarkTrees[1], bookmarkTrees[0]]
    expect(generator.next(updatedBookmarkTrees).value).toEqual(
      put(bookmarkCreators.setBookmarkTrees(updatedBookmarkTrees))
    )

    expect(generator.next().done).toBe(true)
  })
})
