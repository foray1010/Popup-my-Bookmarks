import {element} from 'deku';

function clickHandler(event, {props, state}) {
  globals.setRootState({
    editorTarget: null,
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
