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
    hidden: {
      editor: true,
      menu: true,
      menuCover: true
    },
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

  const updateTrees = (newTrees) => {
    setState({trees: newTrees});
  };

  return (
    <div
      onContextMenu={contextMenuHandler}
      onMouseDown={mouseDownHandler}>
      <Panel
        trees={state.trees}
        updateTrees={updateTrees} />
      <div id='menu-cover' class='ninja' hidden={state.hidden.menuCover} />
      <Menu isHidden={state.hidden.menu} />
      <Editor isHidden={state.hidden.editor} />
    </div>
  );
}

export default {initialState, render};
