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
      bookmarkType = 'bookmark';
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

  removeTreeInfoFromIndex(trees, removeFromIndex) {
    // clone the array to avoid polluting the prevState value
    const newTrees = trees.slice();

    newTrees.splice(removeFromIndex);

    globals.setRootState({
      trees: newTrees
    });
  },

  separateThisUrl: 'http://separatethis.com/'
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
