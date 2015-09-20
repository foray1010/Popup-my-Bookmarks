import debounce from 'lodash.debounce'
import element from 'virtual-element'

const debouncedInputHandler = debounce(inputHandler, 200)

let keyword = ''

async function getSearchResult() {
  const result = await chromep.bookmarks.search(keyword)

  const filteredResult = searchResultFilter(result)

  const searchResult = globals.sortByTitle(filteredResult)

  return {
    children: searchResult,
    id: 'search-result'
  }
}

async function inputHandler(event) {
  const searchInput = event.target

  keyword = searchInput.value.trim().replace('\s+', ' ')

  if (keyword === '') {
    globals.setRootState({
      isSearching: false
    })
  } else {
    const searchResult = await getSearchResult()

    globals.setRootState({
      isSearching: true,
      trees: Immutable([searchResult])
    })
  }
}

function render() {
  return (
    <div id='search-box'>
      <img
        id='search-img'
        src='/img/search.png'
        alt=''
        draggable='false' />
      <input
        id='search-input'
        type='search'
        placeholder={chrome.i18n.getMessage('search')}
        tabindex='-1'
        autofocus
        onInput={debouncedInputHandler} />
    </div>
  )
}

function searchResultFilter(results) {
  const isOnlySearchTitle = globals.options.searchTarget === 1
  const newResults = []
  const splittedKeyArr = []

  if (isOnlySearchTitle) {
    for (const splittedKey of keyword.split(' ')) {
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

      if (newResults.length === globals.options.maxResults) {
        break
      }
    }
  }

  return newResults
}

export default {getSearchResult, render}
