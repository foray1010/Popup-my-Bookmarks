import * as R from 'ramda'
import {call, put, select} from 'redux-saga/effects'

import * as CST from '../../../../constants'
import {sortByTitle} from '../../../../functions'
import {bookmarkCreators} from '../../actions'
import {simulateBookmark} from '../utils/converters'
import {searchBookmarks} from '../utils/getters'

export function* getSearchResult({searchKeyword}) {
  try {
    const {options} = yield select()

    if (!searchKeyword) {
      yield put(bookmarkCreators.initBookmarkTrees(options))
      return
    }

    const isSearchTitleOnly = options.searchTarget === 1
    const searchResult = yield call(searchBookmarks, {
      title: searchKeyword,
      ...(isSearchTitleOnly ? null : {url: searchKeyword})
    })

    const sortedPartialResult = R.compose(sortByTitle, R.slice(0, options.maxResults))(
      searchResult
    )

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
