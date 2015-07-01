import {element} from 'deku';

function inputHandler(event, {props, state}) {
  const searchInput = event.target;

  const keyword = searchInput.value;

  if (keyword === '') {
    globals.setRootState({searchResult: null});
  } else {
    chrome.bookmarks.search(keyword, (result) => {
      const searchResult = globals.sortByTitle(
        searchResultFilter(keyword, result)
      );

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
        placeholder={chrome.i18n.getMessage('search')}
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
    keyword.split(' ').forEach((splittedKey) => {
      if (splittedKey !== '') {
        splittedKeyArr.push(splittedKey.toLowerCase());
      }
    });
  }

  results.every((itemInfo) => {
    const itemTitle = itemInfo.title.toLowerCase();

    let isntTitleMatched = false;

    if (!globals.isFolder(itemInfo) &&
        itemInfo.url !== globals.separateThisUrl) {
      if (isOnlySearchTitle) {
        splittedKeyArr.every((splittedKey) => {
          if (!itemTitle.includes(splittedKey)) {
            isntTitleMatched = true;

            return false;
          }

          return true;
        });

        if (isntTitleMatched) {
          return true;
        }
      }

      newResults.push(itemInfo);

      if (newResults.length === globals.storage.maxResults) {
        return false;
      }
    }

    return true;
  });

  return newResults;
}

export default {render};
