import {element} from 'deku';

import BoxTemplate from './box_template';
import Search from './search';

function render({props, state}) {
  const mainPanelItems = [];
  const subPanelClass = ['panel'];
  const subPanelItems = [];
  const trees = props.trees;

  trees.forEach((treeInfo, treeIndex) => {
    const targetPanelItems = treeIndex % 2 === 0 ?
      mainPanelItems : subPanelItems;

    targetPanelItems.push(
      <BoxTemplate
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
          <div class='panel-width' />
          {subPanelItems}
        </div>
        <div id='main' class='panel'>
          <div class='panel-width' />
          <Search />
          {mainPanelItems}
        </div>
      </div>
    </div>
  );
}

export default {render};
