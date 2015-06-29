import {element} from 'deku';

const _getMsg = chrome.i18n.getMessage;

function addCurrentPage(menuTarget) {
  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, (results) => {
    const currentTab = results[0];

    createBookmarkItem(menuTarget, currentTab.title, currentTab.url);
  });
}

function afterRender({props}, el) {
  const menuTarget = props.menuTarget;

  const isHidden = !menuTarget;

  if (!isHidden) {
    setMenuPos(el, props.mousePos);
  }
}

function closeMenu() {
  globals.setRootState({
    menuTarget: null
  });
}

function createBookmarkItem(menuTarget, title, url) {
  chrome.bookmarks.create({
    parentId: menuTarget.parentId,
    title: title,
    url: url,
    index: menuTarget.index + 1
  });
}

function getChildrenHiddenStatus(props) {
  const menuTarget = props.menuTarget;

  let childrenHiddenStatus = [];

  switch (globals.getBookmarkType(menuTarget)) {
    case 'folder':
    case 'bookmark':
      if (globals.isRootFolder(menuTarget)) {
        childrenHiddenStatus = [false, true, true, true, true];
      } else if (props.searchResult) {
        childrenHiddenStatus = [false, false, false, true, true];
      } else {
        childrenHiddenStatus = [false, false, false, false, false];
      }
      break;

    case 'no-bookmark':
      childrenHiddenStatus = [true, true, false, false, true];
  }

  return childrenHiddenStatus;
}

function getMenuItemNum(menuItem) {
  const menuItemList = document.getElementsByClassName('menu-item');

  return Array.prototype.indexOf.call(menuItemList, menuItem);
}

function menuClickEvent(event, {props}) {
  const menuTarget = props.menuTarget;
  const target = event.target;

  const menuItemNum = getMenuItemNum(target);

  switch (menuItemNum) {
    case 0: // Open bookmark(s) in background tab or this window
    case 1: // in new window
    case 2: // in incognito window
      globals.openMultipleBookmarks(menuTarget, menuItemNum);
      break;

    case 3: // Edit... or Rename...
      globals.setRootState({
        editTarget: props.menuTarget,
        menuTarget: null
      });
      return true;

    case 4: // Delete
      removeBookmarkItem(menuTarget);
      break;

    case 5: // Cut
    case 6: // Copy
    case 7: // Paste
      break;

    case 9: // Add folder...
      return true;

    case 8: // Add current page
      addCurrentPage(menuTarget);
      break;

    case 10: // Add separator
      break;

    case 11: // Sort by name
  }

  closeMenu();
}

function removeBookmarkItem(menuTarget) {
  if (globals.isFolder(menuTarget)) {
    chrome.bookmarks.removeTree(menuTarget.id);
  } else {
    chrome.bookmarks.remove(menuTarget.id);
  }
}

function render({props, state}) {
  const menuTarget = props.menuTarget;

  const isHidden = !menuTarget;

  let menuItems;

  if (menuTarget) {
    const childrenHiddenStatus = getChildrenHiddenStatus(props);
    const menuPattern = [
      [],
      [],
      ['cut', 'copy', 'paste'],
      ['addPage', 'addFolder', 'addSeparator'],
      ['sortByName']
    ];

    if (globals.isFolder(menuTarget)) {
      menuPattern[0] = ['openAll', 'openAllInN', 'openAllInI'];
      menuPattern[1] = ['rename', 'del'];
    } else {
      menuPattern[0] = ['openInB', 'openInN', 'openInI'];
      menuPattern[1] = ['edit', 'del'];
    }

    menuItems = menuPattern.map((menuAreaKeys, menuAreaIndex) => {
      const isMenuAreaHidden = childrenHiddenStatus[menuAreaIndex];
      const menuAreaItems = menuAreaKeys.map((menuItemKey) => {
        return (
          <p
            class='item menu-item'
            onClick={menuClickEvent}>
            {_getMsg(menuItemKey)}
          </p>
        );
      });

      return <div hidden={isMenuAreaHidden}>{menuAreaItems}</div>;
    });
  }

  return <div id='menu' hidden={isHidden}>{menuItems}</div>;
}

function setMenuPos(el, mousePos) {
  const body = document.body;
  const menuHeight = el.offsetHeight;
  const menuWidth = el.offsetWidth;

  const bodyHeight = body.scrollHeight;
  const bodyWidth = body.offsetWidth;

  if (menuHeight > bodyHeight) {
    body.style.height = menuHeight + 'px';
  }

  if (menuWidth > bodyWidth) {
    body.style.width = menuWidth + 'px';
  }

  const bottomPos = bodyHeight - menuHeight - mousePos.y;
  const rightPos = bodyWidth - menuWidth - mousePos.x;

  el.style.bottom = Math.max(bottomPos, 0) + 'px';
  el.style.right = Math.max(rightPos, 0) + 'px';
}

export default {afterRender, render};
