import {element} from 'deku';

function closeHandler(event, {props, state}) {

}

function render({props, state}) {
  const treeInfo = props.treeInfo;

  const isRootBox = globals.isRootFolder(treeInfo);

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
