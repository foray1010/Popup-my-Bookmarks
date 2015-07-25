import debounce from 'lodash.debounce'
import {element} from 'deku'
import forEach from 'lodash.foreach'

const debouncedInputHandler = debounce(inputHandler, 200)

function inputHandler(event) {
  const searchInput = event.target

  const keyword = searchInput.value

  if (keyword === '') {
    globals.setRootState({
      searchResult: null
    })
  } else {
    chrome.bookmarks.search(keyword, (result) => {
      const searchResult = globals.sortByTitle(
        searchResultFilter(keyword, result)
      )

      globals.setRootState({
        searchResult: Immutable(searchResult)
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

function searchResultFilter(keyword, results) {
  const isOnlySearchTitle = globals.storage.searchTarget === 1
  const newResults = []
  const splittedKeyArr = []

  if (isOnlySearchTitle) {
    forEach(keyword.split(' '), (splittedKey) => {
      if (splittedKey !== '') {
        splittedKeyArr.push(splittedKey.toLowerCase())
      }
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

      if (newResults.length === globals.storage.maxResults) {
        return false
      }
    }
  })

  return newResults
}

export default {render}
