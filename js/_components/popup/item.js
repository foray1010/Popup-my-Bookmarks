import {element} from 'deku';

function clickHandler(event, {props, state}) {
  const itemInfo = props.itemInfo;
  const mouseButton = event.button;

  chrome.bookmarks.get(itemInfo.id, (node) => {
    clickSwitcher(mouseButton, node[0].url);
  });
}

function clickSwitcher(mouseButton, itemUrl) {
  let switcher;

  if (mouseButton === 0) {
    switcher = 'Left';

    // if (ON_MOD_KEY === 16) {
    //   switcher += 'Shift';
    // } else if (ON_MOD_KEY === 17) {
    //   switcher += 'Ctrl';
    // }
  } else {
    switcher = 'Middle';
  }

  const handlerId = globals.storage['clickBy' + switcher];

  switch (handlerId) {
    case 0:
    case 1:
      if (itemUrl.indexOf('javascript') !== 0) {
        chrome.tabs.update({url: itemUrl});
      } else {
        if (globals.storage.bookmarklet) {
          chrome.tabs.executeScript(null, {code: itemUrl});
        } else if (confirm(_getMsg('alert_bookmarklet'))) {
          openOptionsPage();
        }
      }
      break;

    case 2:
    case 3:
    case 4:
      chrome.tabs.create({
        url: itemUrl,
        active: handlerId === 2
      });
      break;

    case 5:
    case 6:
      chrome.windows.create({
        url: itemUrl,
        incognito: handlerId === 6
      });
  }

  if (handlerId !== 1 && handlerId !== 4) {
    setTimeout(window.close, 200);
  }
}

function contextMenuHandler(event, {props, state}, updateState) {
  // disable native context menu
  event.preventDefault();

  const itemInfo = props.itemInfo;

  let hideParam;

  switch (getBookmarkType(itemInfo)) {
    case 'folder':
    case 'bkmark':
      if (isRootFolder(itemInfo)) {
        hideParam = [false, true, true, true, true];
      // } else if (!IS_SEARCHING) {
      //   hideParam = [false, false, false, false, false];
      } else {
        hideParam = [false, false, false, true, true];
      }
      break;

    case 'no-bkmark':
      hideParam = [true, true, false, false, true];
  }

  console.log(hideParam);
}

function dragEndHandler(event, {props, state}) {

}

function dragOverHandler(event, {props, state}) {

}

function dragStartHandler(event, {props, state}) {

}

function getBookmarkType(itemInfo) {
  let bookmarkType;

  if (itemInfo.url) {
    bookmarkType = 'bkmark';
  } else {
    bookmarkType = 'folder';
  }

  return bookmarkType;
}

function isRootFolder(itemInfo) {
  return itemInfo.parentId === '0';
}

function mouseOutHandler(event, {props, state}, updateState) {
  if (state.isSelected) {
    updateState({isSelected: false});
  }
}

function mouseOverHandler(event, {props, state}, updateState) {
  if (!state.isSelected) {
    updateState({isSelected: true});
  }
}

function render({props, state}) {
  const itemClasses = [
    'item',
    'bookmark-item',
    'no-text-overflow'
  ];
  const itemInfo = props.itemInfo;

  const itemTitle = itemInfo.title || itemInfo.url;

  let iconSrc;
  let isDraggable = true;

  if (itemInfo.url) {
    if (itemInfo.url === globals.separateThisUrl) {
      itemClasses.push('separator');
    } else {
      iconSrc = `chrome://favicon/${itemInfo.url}`;
    }
  } else {
    iconSrc = 'img/folder.png';

    if (isRootFolder(itemInfo)) {
      itemClasses.push('rootfolder');

      isDraggable = false;
    }
  }

  if (state.isSelected) {
    itemClasses.push('selected');
  }

  return (
    <p
      class={itemClasses}
      draggable={isDraggable}
      onClick={clickHandler}
      onContextMenu={contextMenuHandler}
      onDragEnd={dragEndHandler}
      onDragOver={dragOverHandler}
      onDragStart={dragStartHandler}
      onMouseOut={mouseOutHandler}
      onMouseOver={mouseOverHandler}>
      <img class='icon' src={iconSrc} alt='' draggable='false' />
      <span>{itemTitle}</span>
    </p>
  );
}

export default {render};
