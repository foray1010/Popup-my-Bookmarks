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
    menuTarget: null,
    mousePos: {x: 0, y: 0},
    searchResult: null,
    trees: [props.defExpandTree]
  };
}

function initStyleOptions() {
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
  const separatorHeightPx = (globals.itemHeight / 2) - 2 + 'px';

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
  globals.setRootState = setState;

  // if menu or editor has target, show menu-cover
  const isHiddenMenuCover = !(state.menuTarget || state.editTarget);

  return (
    <div
      id='app'
      onContextMenu={contextMenuHandler}
      onMouseDown={mouseDownHandler}>
      <Panel
        searchResult={state.searchResult}
        trees={state.trees} />
      <MenuCover isHidden={isHiddenMenuCover} />
      <Menu
        menuTarget={state.menuTarget}
        mousePos={state.mousePos}
        searchResult={state.searchResult} />
      <Editor editTarget={state.editTarget} />
    </div>
  );
}

export default {beforeMount, initialState, render};
