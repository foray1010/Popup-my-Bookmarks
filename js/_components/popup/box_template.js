import {element} from 'deku';

import BookmarkItem from './bookmark_item';

function afterRender(component, el) {
  setHeight(el);
}

function closeHandlerByFolderCover(event, {props}) {
  removeTreeInfoFromIndex(props.trees, props.treeIndex + 1);
}

function closeHandlerbyHeadClose(event, {props}) {
  removeTreeInfoFromIndex(props.trees, props.treeIndex);
}

function removeTreeInfoFromIndex(trees, removeFromIndex) {
  // clone the array to avoid polluting the prevState value
  const newTrees = trees.slice();

  newTrees.splice(removeFromIndex);

  globals.setRootState({
    trees: newTrees
  });
}

function render({props, state}) {
  const treeItems = [];
  const treeIndex = props.treeIndex;
  const trees = props.trees;

  // only hide the folder if it is not the top two folder
  const isHiddenFolderCover = trees.length - treeIndex <= 2;
  const isRootBox = treeIndex === 0;
  const treeInfo = trees[treeIndex];

  const pushTreeItem = (thisTreeInfo) => {
    thisTreeInfo.children.forEach((itemInfo) => {
      treeItems.push(
        <BookmarkItem
          key={itemInfo.id}
          itemInfo={itemInfo}
          treeIndex={treeIndex}
          trees={trees} />
      );
    });
  };

  if (isRootBox) {
    pushTreeItem(globals.rootTree);
  }

  pushTreeItem(treeInfo);

  return (
    <div class='box-template'>
      <div class='head-box' hidden={isRootBox}>
        <div class='head-title no-text-overflow'>{treeInfo.title}</div>
        <div class='head-close' onClick={closeHandlerbyHeadClose} />
      </div>
      <div
        class='bookmark-list'
        onScroll={scrollHandler}
        onWheel={wheelHandler}>
        {treeItems}
      </div>
      <div
        class='cover'
        hidden={isHiddenFolderCover}
        onClick={closeHandlerByFolderCover} />
    </div>
  );
}

function scrollHandler(event, {props, state}) {
}

function setHeight(el) {
  const bookmarkList = el.getElementsByClassName('bookmark-list')[0];

  // head-box and search-box height
  const bookmarkListOffsetTop = bookmarkList.getBoundingClientRect().top;

  const maxListHeight = globals.maxHeight - bookmarkListOffsetTop;

  const listHeight = Math.min(bookmarkList.scrollHeight, maxListHeight);

  const bodyHeight = listHeight + bookmarkListOffsetTop;

  bookmarkList.style.maxHeight = listHeight + 'px';

  document.body.style.height = Math.min(bodyHeight, globals.maxHeight) + 'px';
}

function wheelHandler(event, {props, state}) {
  event.preventDefault();
}

export default {afterRender, render};
