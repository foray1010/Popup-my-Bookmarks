/* eslint redux-saga/no-unhandled-errors: 'off' */

import Chance from 'chance'
import * as R from 'ramda'
import {call, put, select} from 'redux-saga/effects'
import {getType} from 'typesafe-actions'

import optionsFixture from '../../../../../core/__fixtures__/options.json'
import {OPTIONS} from '../../../../constants'
import * as bookmarkCreators from '../../actions'
import bookmarkTrees from '../__fixtures__/bookmarkTrees'
import searchResult from '../__fixtures__/searchResult'
import searchTitleOnlyResult from '../__fixtures__/searchTitleOnlyResult'
import {searchBookmarks} from '../utils/getters'
import {getSearchResult, searchKeywordMatcher} from './getSearchResult'

const chance = Chance('getSearchResult')

describe('searchKeywordMatcher', () => {
  test('return true if all keywords is matched', () => {
    const searchKeyword = 'a b c'

    expect(searchKeywordMatcher(searchKeyword, 'abc')).toBe(true)
    expect(searchKeywordMatcher(searchKeyword, 'cab')).toBe(true)
    expect(searchKeywordMatcher(searchKeyword, 'cabdefg')).toBe(true)
  })
  test('return false if one of the keywords is not matched', () => {
    const searchKeyword = 'a b c'

    expect(searchKeywordMatcher(searchKeyword, 'ca')).toBe(false)
    expect(searchKeywordMatcher(searchKeyword, 'z')).toBe(false)
    expect(searchKeywordMatcher(searchKeyword, '')).toBe(false)
  })
  test('should be case insensitive', () => {
    const searchKeyword = 'A b c'

    expect(searchKeywordMatcher(searchKeyword, 'abC')).toBe(true)
  })
})

describe('getSearchResult', () => {
  test('init bookmark trees if `searchKeyword` is empty', () => {
    const searchKeyword = ''

    const generator = getSearchResult({
      type: getType(bookmarkCreators.getSearchResult),
      payload: {searchKeyword}
    })

    expect(generator.next().value).toEqual(put(bookmarkCreators.initBookmarkTrees()))

    expect(generator.next().done).toBe(true)
  })
  test('get search result with limited and sorted result if `searchKeyword` is not empty', () => {
    const options = {...optionsFixture, [OPTIONS.MAX_RESULTS]: 10, [OPTIONS.SEARCH_TARGET]: 0}
    const searchKeyword = chance.word()

    const generator = getSearchResult({
      type: getType(bookmarkCreators.getSearchResult),
      payload: {searchKeyword}
    })

    expect(generator.next().value).toEqual(select(R.identity))

    // @ts-ignore
    expect(generator.next({options}).value).toEqual(
      call(searchBookmarks, {
        query: searchKeyword
      })
    )

    // @ts-ignore
    expect(generator.next(bookmarkTrees[0].children).value).toEqual(
      put(bookmarkCreators.setBookmarkTrees(searchResult))
    )

    expect(generator.next().done).toBe(true)
  })
  test('get search result by title only if `[OPTIONS.SEARCH_TARGET]` is `1`', () => {
    const options = {...optionsFixture, [OPTIONS.MAX_RESULTS]: 10, [OPTIONS.SEARCH_TARGET]: 1}
    const searchKeyword = 'a'

    const generator = getSearchResult({
      type: getType(bookmarkCreators.getSearchResult),
      payload: {searchKeyword}
    })

    expect(generator.next().value).toEqual(select(R.identity))

    // @ts-ignore
    expect(generator.next({options}).value).toEqual(
      call(searchBookmarks, {
        query: searchKeyword
      })
    )

    // @ts-ignore
    expect(generator.next(bookmarkTrees[0].children).value).toEqual(
      put(bookmarkCreators.setBookmarkTrees(searchTitleOnlyResult))
    )

    expect(generator.next().done).toBe(true)
  })
})
