import {element} from 'deku';

let ITEM_HEIGHT = 22; // test

function mouseWheelHandler(event, {props, state}) {
  event.preventDefault();

  // control scrolling speed
  this.scrollTop -= ITEM_HEIGHT * event.wheelDelta / 120 >> 0;
}

function render({props, state}) {
  return (
    <div class='box-template'>
      <div class='headbox'>
        <div class='head-title no-text-overflow'>{''}</div>
        <div class='head-close' />
      </div>
      <div
        class='folderlist'
        onMouseWheel={mouseWheelHandler}
        onScroll={scrollHandler}>
        {props.treeItems}
      </div>
    </div>
  );
}

function scrollHandler(event, {props, state}) {
  console.log(event);
}

export default {render};
