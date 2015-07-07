import {element, render, tree} from 'deku';

import App from './_components/popup/app';

window.globals = {
  goldenGap: 2,
  maxHeight: 596,
  separateThisUrl: 'http://separatethis.com/',

  isFolder(itemInfo) {
    return !itemInfo.url;
  },

  isFolderOpened(trees, itemInfo) {
    return trees.some((treeInfo) => treeInfo.id === itemInfo.id);
  },

  isItemInView(item) {
    const itemBottomOffsetTop = item.offsetTop + item.offsetHeight;
    const itemParent = item.parentNode;

    const parentScrollTop = itemParent.scrollTop;

    return (
      itemBottomOffsetTop > parentScrollTop &&
      itemParent.offsetHeight + parentScrollTop >= itemBottomOffsetTop
    );
  },

  getBookmarkType(itemInfo) {
    if (itemInfo.parentId === '0') {
      return 'root-folder';
    }

    if (globals.isFolder(itemInfo)) {
      return 'folder';
    }

    if (itemInfo.url === globals.separateThisUrl) {
      return 'separator';
    }

    return 'bookmark';
  },

  getSingleTree(id) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.get(id, (itemInfo) => {
        chrome.bookmarks.getChildren(id, (childrenInfo) => {
          if (childrenInfo === undefined) {
            reject();
            return false;
          }

          const treeInfo = itemInfo[0];
          treeInfo.children = childrenInfo;

          resolve(treeInfo);
        });
      });
    });
  },

  openMultipleBookmarks(itemInfo, menuItemNum) {
    const urlList = [];

    return new Promise((resolve, reject) => {
      if (globals.isFolder(itemInfo)) {
        chrome.bookmarks.getSubTree(itemInfo.id, (results) => {
          const childrenInfo = results[0].children;

          for (let thisItemInfo of childrenInfo) {
            const url = thisItemInfo.url;

            if (globals.getBookmarkType(thisItemInfo) === 'bookmark') {
              urlList.push(url);
            }
          }

          const msgAskOpenAll = chrome.i18n.getMessage(
            'askOpenAll', '' + urlList.length
          );

          if (globals.storage.warnOpenMany &&
              urlList.length > 5 &&
              !confirm(msgAskOpenAll)) {
            reject();
          } else {
            resolve();
          }
        });
      } else {
        chrome.bookmarks.get(itemInfo.id, (results) => {
          const thisItemInfo = results[0];

          urlList.push(thisItemInfo.url);

          resolve();
        });
      }
    })
      .then(() => {
        if (menuItemNum === 0) {
          for (let url of urlList) {
            chrome.tabs.create({
              url: url,
              active: false
            });
          }
        } else {
          chrome.windows.create({
            url: urlList,
            incognito: menuItemNum !== 1
          });
        }

        window.close();
      });
  },

  openOptionsPage() {
    chrome.tabs.create({url: 'options.html'});
  },

  removeTreeInfoFromIndex(trees, removeFromIndex) {
    // clone the array to avoid polluting the prevState value
    const newTrees = trees.slice();

    newTrees.splice(removeFromIndex);

    globals.setRootState({
      trees: newTrees
    });
  },

  sortByTitle(bookmarkList) {
    return bookmarkList.sort((bookmark1, bookmark2) => {
      return bookmark1.title.localeCompare(bookmark2.title);
    });
  }
};

new Promise((resolve) => {
  chrome.storage.sync.get(null, (storage) => {
    globals.storage = storage;

    // if first run
    if (globals.storage.hideRootFolder === undefined) {
      globals.openOptionsPage();
    } else {
      resolve();
    }
  });
})
  .then(() => {
    return globals.getSingleTree('0')
      .then((treeInfo) => {
        treeInfo.children = treeInfo.children.filter((itemInfo) => {
          const itemIdNum = 1 * itemInfo.id;

          const isFilterThisItem = itemIdNum === globals.storage.defExpand ||
            globals.storage.hideRootFolder.includes(itemIdNum);

          return !isFilterThisItem;
        });

        globals.rootTree = treeInfo;
      });
  })
  .then(() => {
    globals.getSingleTree('' + globals.storage.defExpand)
      .then((defExpandTree) => {
        const app = tree(
          <App defExpandTree={defExpandTree} />
        );

        render(app, document.getElementById('container'));
      });
  });
