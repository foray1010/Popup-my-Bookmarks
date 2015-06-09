import {element} from 'deku';

import BoxTemplate from './box_template';
import Item from './item';
import Search from './search';

function render({props, state}) {
  const mainBoxes = [];
  const subBoxes = [];
  const treeItemsList = [];

  props.trees.forEach((treeInfo, treeIndex) => {
    const isRootTree = treeIndex === 0;

    const treeItemsIndex = isRootTree ? 0 : treeIndex - 1;

    treeInfo.forEach((itemInfo) => {
      if (!treeItemsList[treeItemsIndex]) {
        treeItemsList[treeItemsIndex] = [];
      }

      treeItemsList[treeItemsIndex].push(<Item itemInfo={itemInfo} />);
    });
  });

  treeItemsList.forEach((treeItems, treeItemsIndex) => {
    const targetBox = treeItemsIndex % 2 === 0 ? mainBoxes : subBoxes;

    targetBox.push(<BoxTemplate treeItems={treeItems} />);
  });

  return (
    <div>
      <div id='sub' class='panel panel-width'>
        {subBoxes}
      </div>
      <div id='main' class='panel panel-width'>
        <Search />
        {mainBoxes}
      </div>
    </div>
  );
}

export default {render};
