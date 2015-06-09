import {element, render, tree} from 'deku';

import PMB from './_components/pmb';

window.globals = {
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
    return new Promise((resolve) => {
      chrome.bookmarks.getChildren('0', (rootTreeInfo) => {
        const minRootTreeInfo = rootTreeInfo.filter((itemInfo) => {
          const itemIdNum = 1 * itemInfo.id;

          const isFilterThisItem = itemIdNum === globals.storage.defExpand ||
            globals.storage.hideRootFolder.includes(itemIdNum);

          return isFilterThisItem;
        });

        trees.push(minRootTreeInfo);

        resolve();
      });
    });
  })
  .then(() => {
    return new Promise((resolve) => {
      const defExpandStr = '' + globals.storage.defExpand;

      chrome.bookmarks.getChildren(defExpandStr, (treeInfo) => {
        trees.push(treeInfo);

        resolve();
      });
    });
  })
  .then(() => {
    const app = tree(<PMB trees={trees} />);

    render(app, document.getElementById('container'));
  });
