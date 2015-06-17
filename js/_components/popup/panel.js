import {element} from 'deku';

import BookmarkItem from './bookmark_item';
import BoxTemplate from './box_template';
import Search from './search';

function render({props, state}) {
  const boxClasses = ['panel', 'panel-width'];
  const mainBoxes = [];
  const subBoxes = [];
  const treeItemsList = [];

  props.trees.forEach((treeInfo, treeIndex) => {
    const childrenInfo = treeInfo.children;

    const isRootTree = treeIndex === 0;

    const treeItemsIndex = isRootTree ? 0 : treeIndex - 1;

    childrenInfo.forEach((itemInfo) => {
      if (!treeItemsList[treeItemsIndex]) {
        treeItemsList[treeItemsIndex] = [];
      }

      treeItemsList[treeItemsIndex].push(<BookmarkItem itemInfo={itemInfo} />);
    });
  });

  treeItemsList.forEach((treeItems, treeItemsIndex) => {
    const targetBox = treeItemsIndex % 2 === 0 ? mainBoxes : subBoxes;

    const treeIndex = treeItemsIndex + 1;
    const treeInfo = props.trees[treeIndex];

    targetBox.push(
      <BoxTemplate treeInfo={treeInfo}>
        {treeItems}
      </BoxTemplate>
    );
  });

  return (
    <div>
      <div id='sub' class={boxClasses}>
        {subBoxes}
      </div>
      <div id='main' class={boxClasses}>
        <Search />
        {mainBoxes}
      </div>
    </div>
  );
}

export default {render};
