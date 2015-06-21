import {element} from 'deku';

import BookmarkItem from './bookmark_item';

function afterRender(component, el) {
  setHeight(el);
}

function closeHandler(event, {props, state}) {

}

function render({props, state}) {
  const treeInfo = props.treeInfo;
  const treeItems = [];
  const trees = props.trees;

  const treesIndex = trees.indexOf(treeInfo);

  // only hide the folder if it is not the top two folder
  const isHiddenFolderCover = trees.length - treesIndex <= 2;
  const isRootBox = treesIndex === 0;

  const pushTreeItem = (thisTreeInfo) => {
    thisTreeInfo.children.forEach((itemInfo) => {
      treeItems.push(
        <BookmarkItem
          itemInfo={itemInfo}
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
        <div class='head-close' onClick={closeHandler} />
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
        onClick={closeHandler} />
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
