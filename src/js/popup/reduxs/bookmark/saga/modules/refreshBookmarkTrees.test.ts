import Chance from 'chance'
import * as R from 'ramda'
import {call, put, select} from 'redux-saga/effects'

import optionsFixture from '../../../../../common/__fixtures__/options.json'
import * as bookmarkCreators from '../../actions'
import bookmarkTrees from '../__fixtures__/bookmarkTrees'
import {getBookmarkTrees} from '../utils/getters'
import {getRestTreeIds, refreshBookmarkTrees} from './refreshBookmarkTrees'

const chance = Chance('refreshBookmarkTrees')

const getRestTreeIdsResult = [
  '5242',
  '7721',
  '9188',
  '2790',
  '3715',
  '9382',
  '8134',
  '8333',
  '7925'
]

describe('getRestTreeIds', () => {
  test('get all tree ids except first tree', () => {
    expect(getRestTreeIds(bookmarkTrees)).toEqual(getRestTreeIdsResult)
  })
  test('allow empty array', () => {
    expect(getRestTreeIds([])).toEqual([])
  })
})

describe('refreshBookmarkTrees', () => {
  test('get search result if search keyword is not empty', () => {
    const generator = refreshBookmarkTrees()

    expect(generator.next().value).toEqual(select(R.identity))

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

    expect(generator.next().value).toEqual(select(R.identity))

    const options = optionsFixture
    const searchKeyword = ''
    expect(
      generator.next({
        bookmark: {
          searchKeyword,
          trees: bookmarkTrees
        },
        options
      }).value
    ).toEqual(call(getBookmarkTrees, getRestTreeIdsResult, options))

    const updatedBookmarkTrees = [bookmarkTrees[1], bookmarkTrees[0]]
    expect(generator.next(updatedBookmarkTrees).value).toEqual(
      put(bookmarkCreators.setBookmarkTrees(updatedBookmarkTrees))
    )

    expect(generator.next().done).toBe(true)
  })
})
