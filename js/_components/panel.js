import {element} from 'deku';

import BoxTemplate from './box_template';
import Search from './search';

function render({props, state}) {
  const mainBoxes = [];
  const subBoxes = [];

  return (
    <div>
      <div id='sub' class='panel panel-width'>
        {subBoxes}
      </div>
      <div id='main' class='panel panel-width'>
        <Search />
        {mainBoxes}
      </div>
    </div>
  );
}

export default {render};
