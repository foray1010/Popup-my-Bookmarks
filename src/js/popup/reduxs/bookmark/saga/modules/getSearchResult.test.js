import Chance from 'chance'
import {call, put, select} from 'redux-saga/effects'

import {bookmarkCreators} from '../../actions'
import bookmarkTrees from '../__fixtures__/bookmarkTrees'
import searchResult from '../__fixtures__/searchResult.json'
import {searchBookmarks} from '../utils/getters'
import {getSearchResult} from './getSearchResult'

const chance = new Chance('getSearchResult')

const fakedSearchKeyword = chance.word()

describe('getSearchResult', () => {
  test('init bookmark trees if `searchKeyword` is empty', () => {
    const searchKeyword = ''

    const generator = getSearchResult({searchKeyword})

    expect(generator.next().value).toEqual(put(bookmarkCreators.initBookmarkTrees()))

    expect(generator.next().done).toBe(true)
  })

  test('get search result with limited and sorted result if `searchKeyword` is not empty', () => {
    const options = {maxResults: 10, searchTarget: 0}
    const searchKeyword = fakedSearchKeyword

    const generator = getSearchResult({searchKeyword})

    expect(generator.next().value).toEqual(select())

    expect(generator.next({options}).value).toEqual(
      call(searchBookmarks, {
        title: searchKeyword,
        url: searchKeyword
      })
    )

    expect(generator.next(bookmarkTrees[0].children).value).toEqual(
      put(bookmarkCreators.setBookmarkTrees(searchResult))
    )

    expect(generator.next().done).toBe(true)
  })

  test('get search result by title only if `searchTarget` is `1`', () => {
    const options = {maxResults: 10, searchTarget: 1}
    const searchKeyword = fakedSearchKeyword

    const generator = getSearchResult({searchKeyword})

    expect(generator.next().value).toEqual(select())

    expect(generator.next({options}).value).toEqual(
      call(searchBookmarks, {
        title: searchKeyword
      })
    )

    expect(generator.next(bookmarkTrees[0].children).value).toEqual(
      put(bookmarkCreators.setBookmarkTrees(searchResult))
    )

    expect(generator.next().done).toBe(true)
  })
})
