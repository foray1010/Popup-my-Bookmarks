import {element} from 'deku'
import debounce from 'lodash.debounce'

import {
  updateSearchKeyword,
  updateTrees
} from '../actions'

const msgSearch = chrome.i18n.getMessage('search')

const debouncedInputHandler = (model) => debounce(async (evt) => {
  const {context, dispatch} = model

  const {options} = context

  const newSearchKeyword = evt.target.value.trim().replace(/\s+/g, ' ')
  const newTrees = []

  if (newSearchKeyword === '') {
    const defExpandTree = await globals.getFirstTree(options)

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

async function getSearchResult(context, newSearchKeyword) {
  const result = await chromep.bookmarks.search(newSearchKeyword)

  const filteredResult = searchResultFilter(context, newSearchKeyword, result)

  const searchResult = globals.sortByTitle(filteredResult)

  return {
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
    for (const splittedKey of newSearchKeyword.split(' ')) {
      splittedKeyArr.push(splittedKey.toLowerCase())
    }
  }

  for (const itemInfo of results) {
    const itemTitle = itemInfo.title.toLowerCase()

    if (globals.getBookmarkType(itemInfo) === 'bookmark') {
      if (isOnlySearchTitle) {
        let isntTitleMatched = false

        for (const splittedKey of splittedKeyArr) {
          if (itemTitle.indexOf(splittedKey) < 0) {
            isntTitleMatched = true
            break
          }
        }

        if (isntTitleMatched) {
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
    return (
      <div id='search-box'>
        <input
          id='search-input'
          type='search'
          placeholder={msgSearch}
          tabindex='-1'
          autofocus
          onInput={debouncedInputHandler(model)}
        />
      </div>
    )
  }
}

export default {
  getSearchResult,
  ...Search
}
