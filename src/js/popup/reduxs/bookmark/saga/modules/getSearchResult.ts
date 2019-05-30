import * as R from 'ramda'
import {SagaIterator} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import * as CST from '../../../../constants'
import {BookmarkInfo} from '../../../../types'
import sortByTitle from '../../../../utils/sortByTitle'
import {RootState} from '../../../rootReducer'
import * as bookmarkCreators from '../../actions'
import {simulateBookmark} from '../../utils/converters'
import {searchBookmarks} from '../utils/getters'

export const searchKeywordMatcher = (searchKeyword: string, title: string) => {
  const lowerCaseTitle = title.toLowerCase()
  return searchKeyword
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .every((x) => lowerCaseTitle.includes(x))
}

export function* getSearchResult({
  payload
}: ActionType<typeof bookmarkCreators.getSearchResult>): SagaIterator {
  try {
    if (!payload.searchKeyword) {
      yield put(bookmarkCreators.initBookmarkTrees())
      return
    }

    const {options}: RootState = yield select(R.identity)

    const searchResult: Array<BookmarkInfo> = yield call(searchBookmarks, {
      query: payload.searchKeyword
    })

    const isSearchTitleOnly = options[CST.OPTIONS.SEARCH_TARGET] === 1
    const sortedPartialResult = R.compose(
      sortByTitle,
      R.slice(0, options[CST.OPTIONS.MAX_RESULTS] || 0),
      (result: Array<BookmarkInfo>) => {
        const filteredResult = result.filter(R.propEq('type', CST.BOOKMARK_TYPES.BOOKMARK))
        if (isSearchTitleOnly) {
          return filteredResult.filter((bookmarkInfo: BookmarkInfo) => {
            return searchKeywordMatcher(payload.searchKeyword, bookmarkInfo.title)
          })
        }
        return filteredResult
      }
    )(searchResult)

    const searchResultTrees = [
      {
        children: sortedPartialResult,
        parent: simulateBookmark({
          id: CST.SEARCH_RESULT_ID,
          type: CST.BOOKMARK_TYPES.FOLDER
        })
      }
    ]
    yield put(bookmarkCreators.setBookmarkTrees(searchResultTrees))
  } catch (err) {
    console.error(err)
  }
}
