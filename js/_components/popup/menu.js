import {element} from 'deku';

const _getMsg = chrome.i18n.getMessage;

const menuPattern = [
  [],
  [],
  ['cut', 'copy', 'paste'],
  ['addPage', 'addFolder', 'addSeparator'],
  ['sortByName']
];

function render({props, state}) {
  const itemInfo = props.menuTarget;

  if (itemInfo) {
    if (globals.isFolder(itemInfo)) {
      menuPattern[0] = ['openAll', 'openAllInN', 'openAllInI'];
      menuPattern[1] = ['rename', 'del'];
    } else {
      menuPattern[0] = ['openInB', 'openInN', 'openInI'];
      menuPattern[1] = ['edit', 'del'];
    }
  }

  const menuItems = menuPattern.map((menuAreaKeys, menuAreaIndex) => {
    const isMenuAreaHidden = props.menuHideChild[menuAreaIndex];
    const menuAreaItems = menuAreaKeys.map((menuItemKey) => {
      return (
        <p class='item menu-item'>
          {_getMsg(menuItemKey)}
        </p>
      );
    });

    return <div hidden={isMenuAreaHidden}>{menuAreaItems}</div>;
  });

  return <div id='menu' hidden={props.isHidden}>{menuItems}</div>;
}

export default {render};
