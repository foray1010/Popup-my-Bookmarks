import {element} from 'deku';

const _getMsg = chrome.i18n.getMessage;

function inputHandler(event, {props, state}) {
  const searchInput = event.target;

  const keyword = searchInput.value;

  if (keyword === '') {
    globals.setRootState({searchResult: null});
  } else {
    chrome.bookmarks.search(keyword, (result) => {
      const searchResult = sortByTitle(searchResultFilter(keyword, result));

      globals.setRootState({searchResult});
    });
  }
}

function render({props, state}) {
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
        placeholder={_getMsg('search')}
        tabindex='-1'
        autofocus
        onInput={inputHandler} />
    </div>
  );
}

function searchResultFilter(keyword, results) {
  const isOnlySearchTitle = globals.storage.searchTarget === 1;
  const newResults = [];
  const splittedKeyArr = [];

  if (isOnlySearchTitle) {
    for (let splittedKey of keyword.split(' ')) {
      if (splittedKey !== '') {
        splittedKeyArr.push(splittedKey.toLowerCase());
      }
    }
  }

  for (let bookmark of results) {
    const bookmarkTitle = bookmark.title.toLowerCase();
    const bookmarkUrl = bookmark.url;

    let isntTitleMatched = false;

    if (bookmarkUrl && bookmarkUrl !== globals.separateThisUrl) {
      if (isOnlySearchTitle) {
        for (let splittedKey of splittedKeyArr) {
          if (!bookmarkTitle.includes(splittedKey)) {
            isntTitleMatched = true;
            break;
          }
        }

        if (isntTitleMatched) {
          continue;
        }
      }

      newResults.push(bookmark);

      if (newResults.length === globals.storage.maxResults) {
        break;
      }
    }
  }

  return newResults;
}

function sortByTitle(bookmarkList) {
  return bookmarkList.sort((bookmark1, bookmark2) => {
    return bookmark1.title.localeCompare(bookmark2.title);
  });
}

export default {render};
