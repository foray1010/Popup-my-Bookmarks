import {element} from 'deku'
import debounce from 'lodash.debounce'

import {
  genDummyItemInfo,
  getBookmarkType,
  getFirstTree,
  sortByTitle
} from '../functions'
import {
  TYPE_BOOKMARK
} from '../constants'
import {
  updateSearchKeyword,
  updateTrees
} from '../actions'
import chromep from '../../lib/chromePromise'

const msgSearch = chrome.i18n.getMessage('search')

const debouncedInputHandler = debounce(async (model, evt) => {
  const {context, dispatch} = model

  const {options} = context

  const newSearchKeyword = evt.target.value.trim().replace(/\s+/g, ' ')
  const newTrees = []

  if (newSearchKeyword === '') {
    const defExpandTree = await getFirstTree(options)

    newTrees.push(defExpandTree)
  } else {
    const searchResult = await getSearchResult(context, newSearchKeyword)

    newTrees.push(searchResult)
  }

  dispatch([
    updateSearchKeyword(newSearchKeyword),
    updateTrees(newTrees)
  ])
}, 200)

export async function getSearchResult(context, newSearchKeyword) {
  const result = await chromep.bookmarks.search(newSearchKeyword)

  const filteredResult = searchResultFilter(context, newSearchKeyword, result)

  const searchResult = sortByTitle(filteredResult)

  return {
    ...genDummyItemInfo(),
    children: searchResult,
    id: 'search-result'
  }
}

function searchResultFilter(context, newSearchKeyword, results) {
  const {options} = context

  const isOnlySearchTitle = options.searchTarget === 1
  const newResults = []
  const splittedKeyArr = []

  if (isOnlySearchTitle) {
    splittedKeyArr.push(
      ...newSearchKeyword.split(' ').map((x) => x.toLowerCase())
    )
  }

  for (const itemInfo of results) {
    if (getBookmarkType(itemInfo) === TYPE_BOOKMARK) {
      if (isOnlySearchTitle) {
        const itemTitle = itemInfo.title.toLowerCase()

        const isTitleMatched = splittedKeyArr.every((x) => itemTitle.includes(x))

        if (!isTitleMatched) {
          continue
        }
      }

      newResults.push(itemInfo)

      if (newResults.length === options.maxResults) {
        break
      }
    }
  }

  return newResults
}

const Search = {
  render(model) {
    const compiledInputHandler = (evt) => debouncedInputHandler(model, evt)

    return (
      <div id='search-box'>
        <input
          id='search-input'
          type='search'
          placeholder={msgSearch}
          tabindex='-1'
          autofocus
          onInput={compiledInputHandler}
        />
      </div>
    )
  }
}

export default Search
