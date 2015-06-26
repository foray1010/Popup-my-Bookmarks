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
      <img id='search-img' src='/img/search.png' alt='' />
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

function searchResultFilter(keyword, result) {
  const isOnlySearchTitle = globals.storage.searchTarget === 1;
  const newResult = [];
  const splittedKeyArr = [];

  if (isOnlySearchTitle) {
    for (let splittedKey of keyword.split(' ')) {
      if (splittedKey !== '') {
        splittedKeyArr.push(splittedKey.toLowerCase());
      }
    }
  }

  result.forEach((bookmark) => {
    const bookmarkTitle = bookmark.title.toLowerCase();
    const bookmarkUrl = bookmark.url;

    if (bookmarkUrl && bookmarkUrl !== globals.separateThisUrl) {
      if (isOnlySearchTitle) {
        for (let splittedKey of splittedKeyArr) {
          if (!bookmarkTitle.includes(splittedKey)) {
            return true;
          }
        }
      }

      newResult.push(bookmark);

      if (newResult.length === globals.storage.maxresult) {
        return false;
      }
    }
  });

  return newResult;
}

function sortByTitle(bookmarkList) {
  return bookmarkList.sort((bookmark1, bookmark2) => {
    return bookmark1.title.localeCompare(bookmark2.title);
  });
}

export default {render};
