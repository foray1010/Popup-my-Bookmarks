import {element} from 'deku';

import HeadBox from './head_box';

function render({props, state}) {
  return (
    <div class='box-template'>
      <HeadBox />
      <div
        class='folder-list'
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
