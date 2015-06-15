import {element} from 'deku';

function clickHandler(event, {props, state}) {
  globals.setRootState({
    hiddenEditor: true,
    hiddenMenu: true,
    hiddenMenuCover: true
  });
}

function render({props, state}) {
  return (
    <div
      id='menu-cover'
      class='ninja'
      hidden={props.isHidden}
      onClick={clickHandler} />
  );
}

export default {render};
