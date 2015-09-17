import debounce from 'lodash.debounce'
import element from 'virtual-element'
import forEach from 'lodash.foreach'

const debouncedInputHandler = debounce(inputHandler, 200)

let keyword = ''

function getSearchResult() {
  return chromep.bookmarks.search(keyword).then((result) => {
    const filteredResult = searchResultFilter(result)

    const searchResult = globals.sortByTitle(filteredResult)

    return {
      children: searchResult,
      id: 'search-result'
    }
  })
}

function inputHandler(event) {
  const searchInput = event.target

  keyword = searchInput.value.trim().replace('\s+', ' ')

  if (keyword === '') {
    globals.setRootState({
      isSearching: false
    })
  } else {
    getSearchResult().then((searchResult) => {
      globals.setRootState({
        isSearching: true,
        trees: Immutable([searchResult])
      })
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
    forEach(keyword.split(' '), (splittedKey) => {
      splittedKeyArr.push(splittedKey.toLowerCase())
    })
  }

  forEach(results, (itemInfo) => {
    const itemTitle = itemInfo.title.toLowerCase()

    if (globals.getBookmarkType(itemInfo) === 'bookmark') {
      if (isOnlySearchTitle) {
        let isntTitleMatched = false

        forEach(splittedKeyArr, (splittedKey) => {
          if (itemTitle.indexOf(splittedKey) < 0) {
            isntTitleMatched = true

            return false
          }
        })

        if (isntTitleMatched) {
          return true
        }
      }

      newResults.push(itemInfo)

      if (newResults.length === globals.options.maxResults) {
        return false
      }
    }
  })

  return newResults
}

export default {getSearchResult, render}
