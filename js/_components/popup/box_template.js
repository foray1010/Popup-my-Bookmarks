import {element} from 'deku';

import BookmarkItem from './bookmark_item';

function closeHandler(event, {props, state}) {

}

function render({props, state}) {
  const treeInfo = props.treeInfo;
  const treeItems = [];

  const isRootBox = globals.isRootFolder(treeInfo);

  const pushTreeItem = (thisTreeInfo) => {
    thisTreeInfo.children.forEach((itemInfo) => {
      treeItems.push(
        <BookmarkItem itemInfo={itemInfo} />
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
    </div>
  );
}

function scrollHandler(event, {props, state}) {
}

function wheelHandler(event, {props, state}) {
  event.preventDefault();
}

export default {render};
