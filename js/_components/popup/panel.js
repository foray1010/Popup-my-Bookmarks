import {element} from 'deku';

import BoxTemplate from './box_template';
import Search from './search';

function render({props, state}) {
  const boxClasses = ['panel', 'panel-width'];
  const mainBoxes = [];
  const subBoxes = [];

  props.trees.forEach((treeInfo, treeIndex) => {
    const targetBox = treeIndex % 2 === 0 ? mainBoxes : subBoxes;

    targetBox.push(
      <BoxTemplate treeInfo={treeInfo} />
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
