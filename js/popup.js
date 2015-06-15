import {element, render, tree} from 'deku';

import App from './_components/popup/app';

window.globals = {
  getSingleTree(id) {
    return new Promise((resolve) => {
      chrome.bookmarks.get(id, (itemInfo) => {
        chrome.bookmarks.getChildren(id, (childrenInfo) => {
          const treeInfo = itemInfo[0];
          treeInfo.children = childrenInfo;

          resolve(treeInfo);
        });
      });
    });
  },
  separateThisUrl: 'http://separatethis.com/'
};

const trees = [];

new Promise((resolve) => {
  chrome.storage.sync.get(null, (storage) => {
    globals.storage = storage;

    resolve();
  });
})
  .then(() => {
    return globals.getSingleTree('0')
      .then((treeInfo) => {
        treeInfo.children = treeInfo.children.filter((itemInfo) => {
          const itemIdNum = 1 * itemInfo.id;

          const isFilterThisItem = itemIdNum === globals.storage.defExpand ||
            globals.storage.hideRootFolder.includes(itemIdNum);

          return isFilterThisItem;
        });

        trees.push(treeInfo);
      });
  })
  .then(() => {
    return globals.getSingleTree('' + globals.storage.defExpand)
      .then((treeInfo) => {
        trees.push(treeInfo);
      });
  })
  .then(() => {
    const app = tree(<App trees={trees} />);

    render(app, document.getElementById('container'));
  });
