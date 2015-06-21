import {element} from 'deku';

function clickHandler(event, {props, state}) {
  globals.setRootState({
    editTarget: null,
    menuTarget: null
  });
}

function render({props, state}) {
  return (
    <div
      id='menu-cover'
      class='cover'
      hidden={props.isHidden}
      onClick={clickHandler} />
  );
}

export default {render};
