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
  const itemClasses = ['item', 'bookmark-item', 'no-text-overflow'];
  const itemInfo = props.itemInfo;

  const itemTitle = itemInfo.title || itemInfo.url;

  let iconSrc;
  let isDraggable = true;

  if (itemInfo.url) {
    if (itemInfo.url === globals.separateThisUrl) {
      itemClasses.push('separator');
    } else {
      iconSrc = `chrome://favicon/${itemInfo.url}`;
    }
  } else {
    iconSrc = 'img/folder.png';

    // when it is a root folder
    if (itemInfo.parentId === '0') {
      itemClasses.push('rootfolder');

      isDraggable = false;
    }
  }

  return (
    <p
      class={itemClasses}
      draggable={isDraggable}
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
