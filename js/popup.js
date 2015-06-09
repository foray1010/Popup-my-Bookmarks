import {element, render, tree} from 'deku';

import Editor from './_components/editor';
import Menu from './_components/menu';
import Panel from './_components/panel';

chrome.storage.sync.get(null, (STORAGE) => {
  const app = tree(
    <div>
      <Panel />
      <div id='menu-cover' class='ninja' hidden />
      <Menu />
      <Editor />
    </div>
  );

  render(app, document.getElementById('container'));
});
