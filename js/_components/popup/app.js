import {element} from 'deku';

import Editor from './editor';
import Menu from './menu';
import MenuCover from './menu_cover';
import Panel from './panel';

function contextMenuHandler(event) {
  const target = event.target;

  // allow native context menu if it is an input element
  if (target.tagName === 'INPUT') {
    return true;
  }

  // disable native context menu
  event.preventDefault();
}

function initialState(props) {
  return {
    editTarget: null,
    hiddenEditor: true,
    hiddenMenu: true,
    hiddenMenuCover: true,
    menuHideChild: [],
    menuTarget: null,
    trees: props.trees
  };
}

// disable the scrolling arrows after middle click
function mouseDownHandler(event) {
  if (event.button === 1) {
    event.preventDefault();
  }
}

function render({props, state}, setState) {
  console.log({props, state});

  window.globals.setRootState = setState;

  return (
    <div
      onContextMenu={contextMenuHandler}
      onMouseDown={mouseDownHandler}>
      <Panel trees={state.trees} />
      <MenuCover isHidden={state.hiddenMenuCover} />
      <Menu
        isHidden={state.hiddenMenu}
        menuHideChild={state.menuHideChild}
        menuTarget={state.menuTarget} />
      <Editor
        editTarget={state.editTarget}
        isHidden={state.hiddenEditor} />
    </div>
  );
}

export default {initialState, render};
