import {element} from 'deku';

import Headbox from './headbox';

function render({props, state}) {
  return (
    <div class='box-template'>
      <Headbox />
      <div
        class='folderlist'
        onScroll={scrollHandler}
        onWheel={wheelHandler}>
        {props.treeItems}
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
