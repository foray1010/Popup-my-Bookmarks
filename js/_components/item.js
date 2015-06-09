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
  return (
    <p
      class='item bookmark-item no-text-overflow'
      draggable='true'
      onClick={clickHandler}
      onDragEnd={dragEndHandler}
      onDragOver={dragOverHandler}
      onDragStart={dragStartHandler}>
      <img class='icon' src={''} alt='' draggable='false' />
      <span>{''}</span>
    </p>
  );
}

export default {render};
