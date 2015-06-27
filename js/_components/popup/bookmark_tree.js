import {element} from 'deku';

import BookmarkItem from './bookmark_item';
import TreeHead from './tree_head';

function afterRender(component, el) {
  setHeight(el);
}

function closeHandler(event, {props}) {
  globals.removeTreeInfoFromIndex(props.trees, props.treeIndex + 1);
}

function render({props, state}) {
  const searchResult = props.searchResult;
  const treeItems = [];
  const treeIndex = props.treeIndex;
  const trees = props.trees;

  const isSearching = !!searchResult;
  const isRootBox = treeIndex === 0;
  const treeInfo = trees[treeIndex];

  // hide the folder if it is not the top two folder
  const isHiddenFolderCover = isSearching || trees.length - treeIndex <= 2;

  const pushTreeItem = (childrenInfo) => {
    for (let itemInfo of childrenInfo) {
      treeItems.push(
        <BookmarkItem
          key={itemInfo.id}
          itemInfo={itemInfo}
          searchResult={searchResult}
          treeIndex={treeIndex}
          trees={trees} />
      );
    }
  };

  let treeHead;
  if (!isSearching && !isRootBox) {
    treeHead = (
      <TreeHead
        treeIndex={treeIndex}
        trees={trees} />
    );
  }

  if (searchResult) {
    pushTreeItem(searchResult);
  } else {
    if (isRootBox) {
      pushTreeItem(globals.rootTree.children);
    }

    pushTreeItem(treeInfo.children);
  }

  return (
    <div class='bookmark-tree'>
      {treeHead}
      <div
        class='bookmark-list'
        onScroll={scrollHandler}
        onWheel={wheelHandler}>
        {treeItems}
      </div>
      <div
        class='cover'
        hidden={isHiddenFolderCover}
        onClick={closeHandler} />
    </div>
  );
}

function scrollHandler(event, {props, state}) {
}

function setHeight(el) {
  const bookmarkList = el.getElementsByClassName('bookmark-list')[0];

  // search-box and tree-head-box height
  const bookmarkListOffsetTop = bookmarkList.getBoundingClientRect().top;

  const maxListHeight = globals.maxHeight - bookmarkListOffsetTop;

  const listHeight = Math.min(bookmarkList.scrollHeight, maxListHeight);

  bookmarkList.style.maxHeight = listHeight + 'px';
}

function wheelHandler(event, {props, state}) {
  event.preventDefault();
}

export default {afterRender, render};
