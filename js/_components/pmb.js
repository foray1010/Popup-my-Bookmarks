import {element} from 'deku';

import Editor from './editor';
import Menu from './menu';
import Panel from './panel';

function initialState(props) {
  return {
    trees: props.globals.trees
  };
}

function render({props, state}, setState) {
  console.log({props, state});

  const updateTrees = (newTrees) => {
    setState({trees: newTrees});
  };

  return (
    <div>
      <Panel
        trees={state.trees}
        updateTrees={updateTrees} />
      <div id='menu-cover' class='ninja' hidden />
      <Menu />
      <Editor />
    </div>
  );
}

export default {initialState, render};
