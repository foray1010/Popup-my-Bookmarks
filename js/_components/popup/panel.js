import {element} from 'deku';

import BookmarkTree from './bookmark_tree';
import Search from './search';

function render({props, state}) {
  const expandTableCell = <div class='panel-width' />;
  const mainPanelItems = [];
  const subPanelClass = ['panel'];
  const subPanelItems = [];
  const trees = props.trees;

  trees.forEach((treeInfo, treeIndex) => {
    const targetPanelItems = treeIndex % 2 === 0 ?
      mainPanelItems : subPanelItems;

    targetPanelItems.push(
      <BookmarkTree
        treeIndex={treeIndex}
        trees={trees} />
    );
  });

  if (!subPanelItems.length) {
    subPanelClass.push('display-none');
  }

  return (
    <div id='panel-box'>
      <div class='panel-row'>
        <div id='sub' class={subPanelClass}>
          {expandTableCell}
          {subPanelItems}
        </div>
        <div id='main' class='panel'>
          {expandTableCell}
          <Search />
          {mainPanelItems}
        </div>
      </div>
    </div>
  );
}

export default {render};
