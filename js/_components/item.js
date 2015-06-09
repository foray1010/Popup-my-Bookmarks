import {element} from 'deku';

function clickHandler(event, {props, state}) {

}

function dragEndHandler(event, {props, state}) {

}

function dragOverHandler(event, {props, state}) {

}

function dragStartHandler(event, {props, state}) {

}

function render({props, state}) {
  const itemInfo = props.itemInfo;

  const iconSrc = `chrome://favicon/${itemInfo.url}`;
  const itemTitle = itemInfo.title || itemInfo.url;

  return (
    <p
      class='item bookmark-item no-text-overflow'
      draggable='true'
      onClick={clickHandler}
      onDragEnd={dragEndHandler}
      onDragOver={dragOverHandler}
      onDragStart={dragStartHandler}>
      <img class='icon' src={iconSrc} alt='' draggable='false' />
      <span>{itemTitle}</span>
    </p>
  );
}

export default {render};
