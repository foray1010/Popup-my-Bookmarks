import {element} from 'deku';

import Editor from './editor';
import Menu from './menu';
import Panel from './panel';

function render({props, state}, setState) {
  console.log({props, state});

  if (!state.trees) {
    state.trees = props.globals.trees;
  }

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

export default {render};
