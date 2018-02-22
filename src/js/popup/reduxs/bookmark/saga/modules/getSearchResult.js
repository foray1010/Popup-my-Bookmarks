// @flow

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'

import * as CST from '../../../../constants'
import {sortByTitle} from '../../../../functions'
import {bookmarkCreators} from '../../actions'
import {simulateBookmark} from '../utils/converters'
import {searchBookmarks} from '../utils/getters'

export const generateSearchKeywordMatcher = (searchKeyword: string) => (title: string) =>
  R.compose(R.all(R.compose(R.flip(R.contains), R.toLower)(title)), R.map(R.toLower), R.split(' '))(
    searchKeyword
  )

type Payload = {|
  searchKeyword: string
|}
export function* getSearchResult({searchKeyword}: Payload): Saga<void> {
  try {
    if (!searchKeyword) {
      yield put(bookmarkCreators.initBookmarkTrees())
      return
    }

    const {options} = yield select()

    const searchResult = yield call(searchBookmarks, {
      query: searchKeyword
    })

    const isSearchTitleOnly = options.searchTarget === 1
    const sortedPartialResult = R.compose(
      sortByTitle,
      R.slice(0, options.maxResults),
      isSearchTitleOnly ?
        R.filter(R.compose(generateSearchKeywordMatcher(searchKeyword), R.prop('title'))) :
        R.identity,
      R.filter(R.propEq('type', CST.TYPE_BOOKMARK))
    )(searchResult)

    const searchResultTrees = [
      {
        children: sortedPartialResult,
        parent: simulateBookmark({
          id: CST.SEARCH_RESULT_ID,
          type: CST.TYPE_FOLDER
        })
      }
    ]
    yield put(bookmarkCreators.setBookmarkTrees(searchResultTrees))
  } catch (err) {
    console.error(err)
  }
}
