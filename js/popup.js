import {element, render, tree} from 'deku';

import PMB from './_components/pmb';

const globals = {
  trees: []
};

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

        globals.trees.push(minRootTreeInfo);

        resolve();
      });
    });
  })
  .then(() => {
    return new Promise((resolve) => {
      const defExpandStr = '' + globals.storage.defExpand;

      chrome.bookmarks.getChildren(defExpandStr, (treeInfo) => {
        globals.trees.push(treeInfo);

        resolve();
      });
    });
  })
  .then(() => {
    const app = tree(<PMB globals={globals} />);

    render(app, document.getElementById('container'));
  });
