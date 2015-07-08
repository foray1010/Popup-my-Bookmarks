import {element} from 'deku';

function afterMount({props}, el) {
  const itemInfo = props.itemInfo;

  if (globals.getBookmarkType(itemInfo) === 'bookmark') {
    setTooltip(el, props);
  }
}

function clickHandler(event, {props, state}) {
  const itemInfo = props.itemInfo;

  if (globals.isFolder(itemInfo)) {
    switch (event.button) {
      case 0:
        if (globals.storage.opFolderBy) {
          if (!globals.isFolderOpened(props.trees, itemInfo)) {
            openFolder(props);
          } else {
            globals.removeTreeInfoFromIndex(props.trees, props.treeIndex + 1);
          }
        }
        break;

      case 1:
        globals.openMultipleBookmarks(itemInfo, 0);
    }
  } else {
    openBookmark(getOpenBookmarkHandlerId(event), itemInfo.url);
  }
}

function contextMenuHandler(event, {props, state}, updateState) {
  // disable native context menu
  event.preventDefault();

  const itemInfo = props.itemInfo;

  globals.setRootState({
    menuTarget: itemInfo,
    mousePos: {x: event.x, y: event.y}
  });
}

function dragEndHandler(event, {props, state}) {

}

function dragOverHandler(event, {props, state}) {

}

function dragStartHandler(event, {props, state}) {

}

function getOpenBookmarkHandlerId(event) {
  const mouseButton = event.button;

  let switcher;

  if (mouseButton === 0) {
    switcher = 'Left';

    if (event.ctrlKey || event.metaKey) {
      switcher += 'Ctrl';
    } else if (event.shiftKey) {
      switcher += 'Shift';
    }
  } else {
    switcher = 'Middle';
  }

  return globals.storage['clickBy' + switcher];
}

function mouseEnterHandler(event, {props, state}, updateState) {
  if (event.target !== event.delegateTarget) {
    return true;
  }

  const isSearching = !!props.searchResult;
  const itemInfo = props.itemInfo;

  if (!isSearching && !globals.storage.opFolderBy) {
    if (globals.isFolder(itemInfo)) {
      if (!globals.isFolderOpened(props.trees, itemInfo)) {
        openFolder(props);
      }
    } else {
      globals.removeTreeInfoFromIndex(props.trees, props.treeIndex + 1);
    }
  }
}

function mouseLeaveHandler(event, {props, state}, updateState) {
  if (event.target !== event.delegateTarget) {
    return true;
  }
}

function openBookmark(handlerId, itemUrl) {
  switch (handlerId) {
    case 0: // current tab
    case 1: // current tab (w/o closing PmB)
      if (itemUrl.indexOf('javascript') !== 0) {
        chrome.tabs.update({url: itemUrl});
      } else {
        const msgAlertBookmarklet = chrome.i18n.getMessage('alert_bookmarklet');

        if (globals.storage.bookmarklet) {
          chrome.tabs.executeScript(null, {code: itemUrl});
        } else if (confirm(msgAlertBookmarklet)) {
          globals.openOptionsPage();
        }
      }
      break;

    case 2: // new tab
    case 3: // background tab
    case 4: // background tab (w/o closing PmB)
      chrome.tabs.create({
        url: itemUrl,
        active: handlerId === 2
      });
      break;

    case 5: // new window
    case 6: // incognito window
      chrome.windows.create({
        url: itemUrl,
        incognito: handlerId === 6
      });
  }

  if (handlerId !== 1 && handlerId !== 4) {
    setTimeout(window.close, 200);
  }
}

function openFolder(props) {
  return globals.getSingleTree(props.itemInfo.id)
    .then((treeInfo) => {
      // clone the array to avoid polluting the prevState value
      const newTrees = props.trees.slice();
      const nextTreeIndex = props.treeIndex + 1;

      newTrees[nextTreeIndex] = treeInfo;

      globals.setRootState({
        trees: newTrees
      });
    });
}

function render({props, state}) {
  const isSearching = !!props.searchResult;
  const itemClasses = [
    'item',
    'bookmark-item',
    'no-text-overflow'
  ];
  const itemInfo = props.itemInfo;

  const itemTitle = itemInfo.title || itemInfo.url;

  let iconSrc;
  let isDraggable = true;

  if (globals.isFolder(itemInfo)) {
    iconSrc = '/img/folder.png';
  }

  switch (globals.getBookmarkType(itemInfo)) {
    case 'root-folder':
      itemClasses.push('root-folder');
      isDraggable = false;
      break;

    case 'separator':
      itemClasses.push('separator');
      break;

    case 'bookmark':
      iconSrc = `chrome://favicon/${itemInfo.url}`;
  }

  if (isSearching) {
    isDraggable = false;
  }

  return (
    <p
      id={itemInfo.id}
      class={itemClasses}
      draggable={isDraggable}
      onClick={clickHandler}
      onContextMenu={contextMenuHandler}
      onDragEnd={dragEndHandler}
      onDragOver={dragOverHandler}
      onDragStart={dragStartHandler}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}>
      <img class='icon' src={iconSrc} alt='' draggable='false' />
      {itemTitle}
    </p>
  );
}

function setTooltip(el, props) {
  const isSearching = !!props.searchResult;
  const itemInfo = props.itemInfo;
  const tooltipArr = [];

  const setTitle = () => {
    if (tooltipArr.length) {
      el.title = tooltipArr.join('\n');
    }
  };

  if (globals.storage.tooltip) {
    tooltipArr.push(itemInfo.title, itemInfo.url);
  }

  if (isSearching) {
    const breadcrumbArr = [];

    const getBreadcrumb = (breadId) => {
      chrome.bookmarks.get(breadId, (node) => {
        const thisItemInfo = node[0];

        if (![itemInfo.id, '0'].includes(thisItemInfo.id)) {
          breadcrumbArr.unshift(thisItemInfo.title);
        }

        if (thisItemInfo.parentId !== undefined) {
          getBreadcrumb(thisItemInfo.parentId);
        } else {
          tooltipArr.unshift(breadcrumbArr.join(' > '));

          setTitle();
        }
      });
    };

    getBreadcrumb(itemInfo.id);
  } else {
    setTitle();
  }
}

export default {afterMount, render};
