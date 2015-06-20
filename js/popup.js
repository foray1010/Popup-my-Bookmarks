import {element, render, tree} from 'deku';

import App from './_components/popup/app';

window.globals = {
  goldenGap: 2,

  isFolder(itemInfo) {
    return !itemInfo.url;
  },

  isRootFolder(itemInfo) {
    return itemInfo.parentId === '0';
  },

  getBookmarkType(itemInfo) {
    let bookmarkType;

    if (globals.isFolder(itemInfo)) {
      bookmarkType = 'folder';
    } else {
      bookmarkType = 'bkmark';
    }

    return bookmarkType;
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

  maxHeight: 596,

  openOptionsPage() {
    chrome.tabs.create({url: 'options.html'});
  },

  separateThisUrl: 'http://separatethis.com/'
};

let defExpandTree;

new Promise((resolve, reject) => {
  chrome.storage.sync.get(null, (storage) => {
    globals.storage = storage;

    // if first run
    if (globals.storage.hideRootFolder === undefined) {
      globals.openOptionsPage();

      reject();
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
    return globals.getSingleTree('' + globals.storage.defExpand)
      .then((treeInfo) => {
        defExpandTree = treeInfo;
      });
  })
  .then(() => {
    const app = tree(
      <App defExpandTree={defExpandTree} />
    );

    render(app, document.getElementById('container'));
  });
