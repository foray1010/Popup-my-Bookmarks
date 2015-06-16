import {element} from 'deku';

import Editor from './editor';
import Menu from './menu';
import MenuCover from './menu_cover';
import Panel from './panel';

function beforeMount() {
  initStyleOptions();
}

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
    menuTarget: null,
    trees: props.trees
  };
}

function initStyleOptions() {
  // +2 for border width, goldenGap*2 for padding
  const itemHeight = 2 + globals.goldenGap * 2 +
    Math.max(globals.storage.fontSize, 16);

  // if the font family's name has whitespace, use quote to embed it
  const fontFamily = globals.storage.fontFamily.split(',')
    .map((x) => {
      x = x.trim();

      if (x.includes(' ')) {
        x = `"${x}"`;
      }

      return x;
    })
    .join(',');

  const fontSizePx = globals.storage.fontSize + 'px';

  // -2 for border width
  const separatorHeightPx = (itemHeight / 2) - 2 + 'px';

  // set panel (#main, #sub) width
  CSS.set('.panel-width', {
    width: globals.storage.setWidth + 'px'
  });

  // set font style
  CSS.set('body', {
    font: fontSizePx + ' ' + fontFamily
  });

  if (globals.storage.fontSize > 16) {
    CSS.set({
      '.bookmark-item': {
        height: fontSizePx,
        'line-height': fontSizePx
      },
      '.icon': {
        width: fontSizePx
      }
    });
  }

  // set separator height depend on item height
  CSS.set('.separator', {
    height: separatorHeightPx,
    'line-height': separatorHeightPx
  });
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
        menuTarget={state.menuTarget} />
      <Editor
        editTarget={state.editTarget}
        isHidden={state.hiddenEditor} />
    </div>
  );
}

export default {beforeMount, initialState, render};
