import {element} from 'deku';

import Editor from './editor';
import Menu from './menu';
import Panel from './panel';

function contextMenuHandler(event) {
  const target = event.event;

  // allow native context menu if it is an input element
  if (target.tagName === 'INPUT') {
    return true;
  }

  // disable native context menu
  event.preventDefault();
}

function initialState(props) {
  return {
    editItem: null,
    hiddenEditor: true,
    hiddenMenu: true,
    hiddenMenuCover: true,
    menuParam: [],
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
      <Panel
        trees={state.trees} />
      <div id='menu-cover' class='ninja' hidden={state.hiddenMenuCover} />
      <Menu
        isHidden={state.hiddenMenu}
        menuParam={state.menuParam} />
      <Editor
        editItem={state.editItem}
        isHidden={state.hiddenEditor} />
    </div>
  );
}

export default {initialState, render};
