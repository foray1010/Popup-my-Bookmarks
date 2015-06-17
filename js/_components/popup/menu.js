import {element} from 'deku';

const _getMsg = chrome.i18n.getMessage;

function closeMenu() {
  globals.setRootState({
    hiddenMenu: true,
    hiddenMenuCover: true
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

  return <div id='menu' hidden={props.isHidden}>{menuItems}</div>;
}

export default {render};
