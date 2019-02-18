// @flow strict

import Chance from 'chance'
import * as R from 'ramda'
import {call, put, select} from 'redux-saga/effects'

import optionsFixture from '../../../../../common/__fixtures__/options.json'
import {bookmarkCreators, bookmarkTypes} from '../../actions'
import bookmarkTrees from '../__fixtures__/bookmarkTrees'
import searchResult from '../__fixtures__/searchResult.json'
import searchTitleOnlyResult from '../__fixtures__/searchTitleOnlyResult.json'
import {searchBookmarks} from '../utils/getters'
import {generateSearchKeywordMatcher, getSearchResult} from './getSearchResult'

const chance = Chance('getSearchResult')

describe('generateSearchKeywordMatcher', () => {
  test('return true if all keywords is matched', () => {
    const searchKeyword = 'a b c'

    const searchKeywordMatcher = generateSearchKeywordMatcher(searchKeyword)

    expect(searchKeywordMatcher('abc')).toBe(true)
    expect(searchKeywordMatcher('cab')).toBe(true)
    expect(searchKeywordMatcher('cabdefg')).toBe(true)
  })
  test('return false if one of the keywords is not matched', () => {
    const searchKeyword = 'a b c'

    const searchKeywordMatcher = generateSearchKeywordMatcher(searchKeyword)

    expect(searchKeywordMatcher('ca')).toBe(false)
    expect(searchKeywordMatcher('z')).toBe(false)
    expect(searchKeywordMatcher('')).toBe(false)
  })
  test('should be case insensitive', () => {
    const searchKeyword = 'A b c'

    const searchKeywordMatcher = generateSearchKeywordMatcher(searchKeyword)

    expect(searchKeywordMatcher('abC')).toBe(true)
  })
})

describe('getSearchResult', () => {
  test('init bookmark trees if `searchKeyword` is empty', () => {
    const searchKeyword = ''

    const generator = getSearchResult({
      type: bookmarkTypes.GET_SEARCH_RESULT,
      payload: {searchKeyword}
    })

    expect(generator.next().value).toEqual(put(bookmarkCreators.initBookmarkTrees()))

    expect(generator.next().done).toBe(true)
  })
  test('get search result with limited and sorted result if `searchKeyword` is not empty', () => {
    const options = {...optionsFixture, maxResults: 10, searchTarget: 0}
    const searchKeyword = chance.word()

    const generator = getSearchResult({
      type: bookmarkTypes.GET_SEARCH_RESULT,
      payload: {searchKeyword}
    })

    expect(generator.next().value).toEqual(select(R.identity))

    expect(generator.next({options}).value).toEqual(
      call(searchBookmarks, {
        query: searchKeyword
      })
    )

    expect(generator.next(bookmarkTrees[0].children).value).toEqual(
      put(bookmarkCreators.setBookmarkTrees(searchResult))
    )

    expect(generator.next().done).toBe(true)
  })
  test('get search result by title only if `searchTarget` is `1`', () => {
    const options = {...optionsFixture, maxResults: 10, searchTarget: 1}
    const searchKeyword = 'a'

    const generator = getSearchResult({
      type: bookmarkTypes.GET_SEARCH_RESULT,
      payload: {searchKeyword}
    })

    expect(generator.next().value).toEqual(select(R.identity))

    expect(generator.next({options}).value).toEqual(
      call(searchBookmarks, {
        query: searchKeyword
      })
    )

    expect(generator.next(bookmarkTrees[0].children).value).toEqual(
      put(bookmarkCreators.setBookmarkTrees(searchTitleOnlyResult))
    )

    expect(generator.next().done).toBe(true)
  })
})
