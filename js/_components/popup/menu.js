import {element} from 'deku';

const _getMsg = chrome.i18n.getMessage;

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
          <p class='item menu-item'>
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
