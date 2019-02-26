// @flow strict

import * as R from 'ramda'
import type {ActionType} from 'redux-actions'
import type {Saga} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'

import * as CST from '../../../../constants'
import {sortByTitle} from '../../../../utils'
import {bookmarkCreators} from '../../actions'
import {simulateBookmark} from '../../utils/converters'
import {searchBookmarks} from '../utils/getters'

export const generateSearchKeywordMatcher = (searchKeyword: string) => (title: string) => {
  const lowerCaseTitle = title.toLowerCase()
  return R.compose(
    R.all((x) => lowerCaseTitle.includes(x)),
    R.filter(Boolean),
    R.split(' '),
    R.toLower
  )(searchKeyword)
}

export function* getSearchResult({
  payload
}: ActionType<typeof bookmarkCreators.getSearchResult>): Saga<void> {
  if (!payload.searchKeyword) {
    yield put(bookmarkCreators.initBookmarkTrees())
    return
  }

  const {options} = yield select(R.identity)

  const searchResult = yield call(searchBookmarks, {
    query: payload.searchKeyword
  })

  const isSearchTitleOnly = options.searchTarget === 1
  const sortedPartialResult = R.compose(
    sortByTitle,
    // flow throw type error in R.slice
    (arr) => arr.slice(0, options.maxResults),
    R.when(
      R.always(isSearchTitleOnly),
      R.filter(
        R.compose(
          generateSearchKeywordMatcher(payload.searchKeyword),
          R.prop('title')
        )
      )
    ),
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
}
