import {element} from 'deku';

const _getMsg = chrome.i18n.getMessage;

function afterRender({props}, el) {
  if (!props.isHidden) {
    setMenuPos(el, props.mousePos);
  }
}

function closeMenu() {
  globals.setRootState({
    menuTarget: null
  });
}

function getChildrenHiddenStatus(itemInfo) {
  let childrenHiddenStatus = [];

  switch (globals.getBookmarkType(itemInfo)) {
    case 'folder':
    case 'bkmark':
      if (globals.isRootFolder(itemInfo)) {
        childrenHiddenStatus = [false, true, true, true, true];
      // } else if (!IS_SEARCHING) {
      //   childrenHiddenStatus = [false, false, false, false, false];
      } else {
        childrenHiddenStatus = [false, false, false, true, true];
      }
      break;

    case 'no-bkmark':
      childrenHiddenStatus = [true, true, false, false, true];
  }

  return childrenHiddenStatus;
}

function getMenuItemNum(menuItem) {
  const menuItemList = document.getElementsByClassName('menu-item');

  return Array.prototype.indexOf.call(menuItemList, menuItem);
}

function menuClickEvent(event) {
  const target = event.target;

  const menuItemNum = getMenuItemNum(target);

  switch (menuItemNum) {
    case 0: // Open bookmark(s) in background tab or this window
    case 1: // in new window
    case 2: // in incognito window
      break;

    case 3: // Edit... or Rename...
    case 9: // Add folder...
      return true;

    case 4: // Delete
      break;

    case 5: // Cut
    case 6: // Copy
    case 7: // Paste
      break;

    case 8: // Add current page
      break;

    case 10: // Add separator
      break;

    case 11: // Sort by name
  }

  closeMenu();
}

function render({props, state}) {
  const itemInfo = props.menuTarget;

  const isHidden = !itemInfo;

  let menuItems;

  if (itemInfo) {
    const childrenHiddenStatus = getChildrenHiddenStatus(itemInfo);
    const menuPattern = [
      [],
      [],
      ['cut', 'copy', 'paste'],
      ['addPage', 'addFolder', 'addSeparator'],
      ['sortByName']
    ];

    if (globals.isFolder(itemInfo)) {
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

  const bodyHeight = body.offsetHeight;
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
