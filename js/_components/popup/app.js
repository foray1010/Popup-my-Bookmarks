import {element} from 'deku';

import Editor from './editor';
import Menu from './menu';
import Panel from './panel';

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
    <div onMouseDown={mouseDownHandler}>
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
