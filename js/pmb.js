chrome.storage.sync.get(null, (STORAGE) => {
  // shorter global
  const _bookmark = chrome.bookmarks;
  const _getMsg = chrome.i18n.getMessage;
  const _tab = chrome.tabs;
  const _win = chrome.windows;

  const _indexOf = Array.prototype.indexOf;

  // pre-defined
  const BOX = [];
  const BOX_PID = []; // store the parentId of each box
  const COPY_CUT_ITEM = {
    id: null,
    isCut: false
  };
  const GOLDEN_GAP = 2;
  const HEIGHT_LIST = [];
  const MAX_HEIGHT = 596;
  const MENU_PATTERN = [
    '', '', '', '|',
    '', 'del', '|',
    'cut', 'copy', 'paste', '|',
    'addPage', 'addFolder', 'addSeparator', '|',
    'sortByName'
  ];
  const NINJA_LIST = [];
  const SEPARATE_THIS = 'http://separatethis.com/';

  // +2 for border width, GOLDEN_GAP*2 for padding
  const ITEM_HEIGHT = 2 + GOLDEN_GAP * 2 + Math.max(STORAGE.fontSize, 16);

  // attr: data: key
  const DATATEXT_BOX_NUM = 'boxNum';
  const DATATEXT_BOOKMARK_TYPE = 'bookmarkType';

  // HTML element
  const BODY = document.body;
  const DRAG_PLACE = id$('drag-place');
  const EDITOR = id$('editor');
  const MENU = id$('menu');
  const MENU_COVER = id$('menu-cover');
  const PANEL = [id$('main'), id$('sub')];
  const PRELOAD = id$('preload');
  const SEARCH_INPUT = id$('search-input');

  // preload
  const BOX_TEMPLATE = PRELOAD.class$('box-template')[0];
  const ITEM = PRELOAD.class$('item')[0];
  const NOBKMARK = PRELOAD.class$('no-bkmark')[0]
    .data(DATATEXT_BOOKMARK_TYPE, 'no-bkmark')
    .addText(_getMsg('noBkmark'));
  const NORESULT = PRELOAD.class$('no-result')[0].addText(_getMsg('noResult'));

  // global variables
  let DRAG_ITEM = null;
  let EDITOR_CREATE;
  let HOVER_TIMEOUT;
  let IS_EXPANDED = false;
  let IS_SEARCHING = false;
  let ON_MOD_KEY;
  let TARGET_ITEM;

  // local storage
  // name
  const NAME_LAST_BOX_PID = 'lastBoxPID';
  const NAME_LAST_SCROLL_TOP = 'lastScrollTop';
  // value
  let LAST_BOX_PID = JSONStorage.get(NAME_LAST_BOX_PID) || [];
  let LAST_SCROLL_TOP = JSONStorage.get(NAME_LAST_SCROLL_TOP) || [];

  // if first run
  if (STORAGE.hideRootFolder === undefined) {
    openOptionsPage();
  }

  // render
  initStyleOptions();
  genFirstBox();

  // handle bookmark event
  initBookmarkEvent();

  // initiate search
  initSearch();

  // initiate menu
  genMenu();
  MENU_COVER.on('click', hideMenu);

  // initiate editor
  initEditor();

  // event delegation
  BODY.on({
    click(event) {
      const mouseButton = event.button;
      const target = event.target;

      let item;

      // reset the cursor to search-input after clicking
      focusSearchInput();

      if (target.hasClass('head-close')) {
        resetBox(target.parentNode.next().data(DATATEXT_BOX_NUM) - 1);

        return true;
      }

      item = getItem(target);
      if (item) {
        switch (item.data(DATATEXT_BOOKMARK_TYPE)) {
          case 'folder':
            if (mouseButton === 1) {
              openBkmarks(item.id, true, 0);
            } else if (STORAGE.opFolderBy) {
              if (!BOX_PID.includes(item.id)) {
                openFolder(item.id);
              } else {
                resetBox(getParentBoxNum(item));
              }
            }
            break;

          case 'bkmark':
            _bookmark.get(item.id, (node) => {
              clickSwitcher(mouseButton, node[0].url);
            });
        }
      }
    },
    // Customize right click menu
    contextmenu(event) {
      const target = event.target;

      let hideParam;
      let item;

      // allow native contextmenu if it is an input element
      if (target.tagName === 'INPUT') {
        return true;
      }

      // disable native contextmenu
      event.preventDefault();
      // clear the action of opening folder
      clearTimeout(HOVER_TIMEOUT);

      item = getItem(target);
      if (!item) {
        focusSearchInput();
        return true;
      }

      switch (item.data(DATATEXT_BOOKMARK_TYPE)) {
        case 'folder':
        case 'bkmark':
          if (isRootFolder(item)) {
            hideParam = [false, true, true, true, true];
          } else if (!IS_SEARCHING) {
            hideParam = [false, false, false, false, false];
          } else {
            hideParam = [false, false, false, true, true];
          }
          break;

        case 'no-bkmark':
          hideParam = [true, true, false, false, true];
      }

      // set availability of menu items
      MENU.children.ascEach((menuItem, itemNum) => {
        menuItem.hidden = hideParam[itemNum];
      });

      modMenuText(isFolderItem(item));

      greyMenuItem([0, 1], item.id === '');
      greyMenuItem([2], COPY_CUT_ITEM.id === null);

      MENU_COVER.hidden = false;
      MENU.hidden = false;

      TARGET_ITEM = item;
      setMenuPos(event.x, event.y);
    },
    dragend: dragEndEvent,
    dragover: dragOverEvent,
    dragstart: dragStartEvent,
    keydown(event) {
      const keyCode = event.keyCode;

      switch (keyCode) {
        case 13:
          enterHandler();
          break;

        case 16: // shift
        case 17: // ctrl
          if (keyCode !== ON_MOD_KEY) {
            ON_MOD_KEY = keyCode;
          }
          break;

        case 37: // left
          arrowLeftRightHandler(true);
          break;

        case 38: // up
          event.preventDefault();
          arrowUpDownHandler(false);
          break;

        case 39: // right
          arrowLeftRightHandler(false);
          break;

        case 40: // down
          event.preventDefault();
          arrowUpDownHandler(true);
          break;

        default:
          focusSearchInput();
      }
    },
    keyup(event) {
      if (event.keyCode === ON_MOD_KEY) {
        ON_MOD_KEY = null;
      }
    },
    // disable the scrolling arrows after middle click
    mousedown(event) {
      if (event.button === 1) {
        event.preventDefault();
      }
    },
    mouseout(event) {
      const item = getItem(event.target);

      if (item) {
        clearTimeout(HOVER_TIMEOUT);

        // if menu is displayed, bookmark item should keep selected
        if (!isMenuCovered() || item.hasClass('menu-item')) {
          item.removeClass('selected');
        }
      }
    },
    mouseover(event) {
      const item = getItem(event.target);

      let selectedItem;

      if (item) {
        HOVER_TIMEOUT = setTimeout(() => {
          if (!STORAGE.opFolderBy) {
            switch (item.data(DATATEXT_BOOKMARK_TYPE)) {
              case 'folder':
                openFolder(item.id);
                break;

              case 'bkmark':
              case 'no-bkmark':
                resetBox(getParentBoxNum(item));
            }
          }
        }, 250);

        // remove selected class applied by
        // arrowUpDownHandler or arrowLeftRightHandler
        selectedItem = getSelectedItem();
        if (selectedItem) {
          selectedItem.removeClass('selected');
        }

        if (!item.hasClass('grey-item')) {
          item.addClass('selected');
        }
      }
    }
  });

  function arrowLeftRightHandler(isLeft) {
    if (isMenuCovered()) {
      return false;
    }

    const selectedItem = getSelectedItem();

    const boxNum = getParentBoxNum(selectedItem);

    const prevBoxNum = boxNum - 1;

    const moveSelectedToBox = (thisBoxNum) => {
      selectedItem.removeClass('selected');
      getBoxList(thisBoxNum).children[selectIndex].addClass('selected');
    };

    let selectIndex = 0;

    if (selectedItem) {
      if (isLeft) {
        if (prevBoxNum >= 0) {
          // select the parent folder item
          selectIndex = id$(BOX_PID[boxNum]).index();

          resetBox(prevBoxNum);
          moveSelectedToBox(prevBoxNum);
        }
      } else {
        if (selectedItem.data(DATATEXT_BOOKMARK_TYPE) === 'folder') {
          openFolder(selectedItem.id, () => {
            moveSelectedToBox(boxNum + 1);
          });
        }
      }
    }
  }

  function arrowUpDownHandler(isDown) {
    const selectedItem = getSelectedItem();

    let itemList;
    let itemParent;
    let lastItemIndex;
    let nextSelectedIndex;
    let nextSelectedItem;
    let origSelectedIndex;

    if (isMenuCovered()) {
      itemParent = MENU;
    } else if (selectedItem) {
      itemParent = selectedItem.parentNode;
    } else {
      itemParent = getBoxList(BOX.length - 1);
    }

    itemList = itemParent.class$('item');
    lastItemIndex = itemList.length - 1;
    if (selectedItem) {
      origSelectedIndex = _indexOf.call(itemList, selectedItem);

      if (isDown) {
        nextSelectedIndex = origSelectedIndex + 1;
        if (nextSelectedIndex > lastItemIndex) {
          nextSelectedIndex = 0;
        }
      } else {
        nextSelectedIndex = origSelectedIndex - 1;
        if (nextSelectedIndex < 0) {
          nextSelectedIndex = lastItemIndex;
        }
      }
    } else {
      nextSelectedIndex = isDown ? 0 : lastItemIndex;
    }

    // remove old selected
    if (selectedItem) {
      selectedItem.removeClass('selected');
    }

    // add new selected
    nextSelectedItem = itemList[nextSelectedIndex];
    if (nextSelectedItem) {
      nextSelectedItem.addClass('selected');

      if (!isMenuCovered() && !isItemInView(nextSelectedItem)) {
        nextSelectedItem.scrollIntoView(!isDown);
      }
    }

    // avoid changing cursor position in SEARCH_INPUT
    SEARCH_INPUT.blur();
  }

  function clickSwitcher(mouseButton, url) {
    let switcher;

    if (mouseButton === 0) {
      switcher = 'Left';

      if (ON_MOD_KEY === 16) {
        switcher += 'Shift';
      } else if (ON_MOD_KEY === 17) {
        switcher += 'Ctrl';
      }
    } else {
      switcher = 'Middle';
    }
    switcher = STORAGE['clickBy' + switcher];

    switch (switcher) {
      case 0:
      case 1:
        if (url.indexOf('javascript') !== 0) {
          _tab.update({url: url});
        } else {
          if (STORAGE.bookmarklet) {
            _tab.executeScript(null, {code: url});
          } else if (confirm(_getMsg('alert_bookmarklet'))) {
            openOptionsPage();
          }
        }
        break;

      case 2:
      case 3:
      case 4:
        _tab.create({
          url: url,
          active: switcher === 2
        });
        break;

      case 5:
      case 6:
        _win.create({
          url: url,
          incognito: switcher === 6
        });
    }

    if (switcher !== 1 && switcher !== 4) {
      setTimeout(window.close, 200);
    }
  }

  function createItemByMenu(title, url, afterFn) {
    const boxNum = getParentBoxNum(TARGET_ITEM);

    _bookmark.create({
      parentId: BOX_PID[boxNum],
      title: title,
      url: url,
      index: getItemIndex(TARGET_ITEM)
    }, afterFn);
  }

  function createItemByMenuIntoView(title, url) {
    createItemByMenu(title, url, (itemInfo) => {
      const item = id$(itemInfo.id);

      if (!isItemInView(item)) {
        item.scrollIntoView(false);
      }
    });
  }

  function dragEndEvent(event) {
    if (DRAG_ITEM) {
      // remove DRAG_ITEM from PRELOAD
      DRAG_ITEM.remove();
      DRAG_ITEM = null;

      // move the dragged item to the location of DRAG_PLACE
      if (DRAG_PLACE.parentNode !== PRELOAD) {
        const bkmarkIndex = getItemIndex(DRAG_PLACE) - 1;
        const boxNum = getParentBoxNum(DRAG_PLACE);
        const target = event.target;

        _bookmark.move(target.id, {
          parentId: BOX_PID[boxNum],
          index: bkmarkIndex
        });

        DRAG_PLACE.appendTo(PRELOAD);
      }

      // reset the cursor to search-input after dragging
      focusSearchInput();
    }
  }

  function dragOverEvent(event) {
    const item = getItem(event.target);

    if (item && DRAG_ITEM) {
      const boxNum = getParentBoxNum(item);
      const isPlaceBefore = event.offsetY < item.offsetHeight / 2;
      const isntDragItem = item.id !== DRAG_ITEM.id;
      const origBoxNum = getParentBoxNum(DRAG_PLACE);

      const itemSibling = isPlaceBefore ? item.prev() : item.next();

      const isntDragItemSibling = !itemSibling ||
                                itemSibling.id !== DRAG_ITEM.id;

      if (isntDragItem &&
          isntDragItemSibling &&
          !isRootFolder(item)) {
        if (isPlaceBefore) {
          DRAG_PLACE.before(item);
        } else {
          DRAG_PLACE.after(item);
        }
      } else {
        DRAG_PLACE.appendTo(PRELOAD);
      }

      // if the DRAG_PLACE is not on the same box,
      // the height of where it come from and go to,
      // need to be reseted
      if (boxNum !== origBoxNum) {
        if (origBoxNum >= 0) {
          setHeight(origBoxNum);
        }
        setHeight(boxNum);
      }

      // item cannot be the parent folder of itself
      if (isntDragItem && isFolderItem(item)) {
        openFolder(item.id);
      } else {
        resetBox(boxNum);
      }
    }
  }

  function dragStartEvent(event) {
    const target = event.target;

    let boxNum;

    if (isItem(target)) {
      DRAG_ITEM = target;

      boxNum = getParentBoxNum(target);
      // if there is next box
      if (boxNum === BOX.length) {
        genNinja(boxNum).hidden = true;
        genNinja(boxNum + 1);
      }

      // hack to prevent dragover and dragend event stop working
      setTimeout(() => {
        // create a cloned dragged item to replace the original one
        target.cloneNode(true).after(target);

        // move the original one to PRELOAD
        // it can prevent dragged item from removing by resetBox,
        // which lead to stop working of dragend event
        DRAG_ITEM.appendTo(PRELOAD);
      });
    }
  }

  function enterHandler() {
    const selectedItem = getSelectedItem();

    if (selectedItem) {
      selectedItem.click();
    } else if (IS_SEARCHING) {
      // enter the first bookmark when press return key
      getBoxList(0).first().click();
    }
  }

  function expandWidth(expand) {
    if (IS_EXPANDED !== expand) {
      IS_EXPANDED = expand;
      modBodyWidth(getNowWidth());
    }
  }

  function focusSearchInput() {
    if (!isMenuCovered() && document.activeElement !== SEARCH_INPUT) {
      SEARCH_INPUT.focus();
    }
  }

  function genBox(boxNum, boxPid) {
    const box = BOX_TEMPLATE.cloneTo(PANEL[boxNum % 2]);

    // remove the old box if exist
    if (BOX[boxNum]) {
      BOX[boxNum].remove();
    }
    // update reference to the new box
    BOX[boxNum] = box;

    BOX_PID[boxNum] = boxPid;
    savLastPID();

    getBoxList(boxNum)
      .data(DATATEXT_BOX_NUM, boxNum)
      .on({
        mousewheel(event) {
          event.preventDefault();

          // control scrolling speed
          this.scrollTop -= ITEM_HEIGHT * event.wheelDelta / 120 >> 0;
        },
        scroll() {
          savLastScroll(true);
        }
      });

    return box;
  }

  function genFirstBox() {
    // remove headbox
    genBox(0, '' + STORAGE.defExpand).first().remove();

    genFirstList();
  }

  function genFirstList() {
    _bookmark.getChildren('0', (rootTreeInfo) => {
      rootTreeInfo.ascEach((stem) => {
        const stemId = 1 * stem.id;

        if (stemId === STORAGE.defExpand ||
            STORAGE.hideRootFolder.includes(stemId)) {
          return true;
        }
        genItem(0, stem).addClass('rootfolder').draggable = false;
      });

      _bookmark.getChildren('' + STORAGE.defExpand, (treeInfo) => {
        genList(0, treeInfo);

        loadLastPos();
      });
    });
  }

  function genItem(boxNum, itemInfo) {
    const newItem = ITEM.cloneTo(getBoxList(boxNum)).prop('id', itemInfo.id);
    const title = itemInfo.title;
    const url = itemInfo.url;

    const icon = newItem.first();

    setItemText(newItem, title, url);

    if (url) {
      newItem.data(DATATEXT_BOOKMARK_TYPE, 'bkmark');

      if (url !== SEPARATE_THIS) {
        // for bookmarks
        icon.src = 'chrome://favicon/' + url;

        setTooltip(newItem, title, url);
      } else {
        // for separators
        newItem.addClass('separator');
      }
    } else {
      // for folders
      newItem.data(DATATEXT_BOOKMARK_TYPE, 'folder');
      icon.src = 'img/folder.png';
    }

    return newItem;
  }

  function genList(boxNum, treeInfo) {
    treeInfo.ascEach((itemInfo) => {
      genItem(boxNum, itemInfo);
    });
    insertNoBkmark(boxNum);

    setHeight(boxNum);
  }

  function genMenu() {
    let area = MENU.new$('div');

    MENU_PATTERN.ascEach((menuItemText) => {
      if (menuItemText === '|') {
        area = MENU.new$('div');
      } else {
        area.new$('p')
          .addClass('item')
          .addClass('menu-item')
          .addText(menuItemText && _getMsg(menuItemText));
      }
    });

    MENU.clickByButton(0, menuEvent);
  }

  function genNinja(boxNum) {
    NINJA_LIST[boxNum] = BOX[boxNum].new$('div').addClass('ninja');

    return NINJA_LIST[boxNum];
  }

  function getBoxList(boxNum) {
    return BOX[boxNum].class$('folderlist')[0];
  }

  function getItem(element) {
    const itemParent = element.parentNode;

    let item;

    if (isItem(element)) {
      item = element;
    } else if (isItem(itemParent)) {
      item = itemParent;
    }

    return item;
  }

  function getItemIndex(item) {
    return item.hasClass('no-bkmark') ? 0 :
      item.index() + 1 - getRootFolderNum(getParentBoxNum(item));
  }

  function getLastScrollTop() {
    const lastScrollTop = [];

    BOX.ascEach((box, boxNum) => {
      lastScrollTop[boxNum] = getBoxList(boxNum).scrollTop;
    });

    return lastScrollTop;
  }

  function getMaxHeight() {
    return Math.max.apply(Math, HEIGHT_LIST);
  }

  function getMenuItem() {
    return MENU.class$('menu-item');
  }

  function getMenuItemNum(menuItem) {
    return _indexOf.call(getMenuItem(), menuItem);
  }

  function getNowHeight() {
    return BODY.offsetHeight;
  }

  function getNowWidth() {
    return IS_EXPANDED ? STORAGE.setWidth * 2 + GOLDEN_GAP : STORAGE.setWidth;
  }

  function getParentBoxNum(item) {
    return 1 * item.parentNode.data(DATATEXT_BOX_NUM);
  }

  function getRootFolderNum(boxNum) {
    return getBoxList(boxNum).class$('rootfolder').length;
  }

  function getSelectedItem() {
    const itemType = !isMenuCovered() ? '.bookmark-item' : '.menu-item';

    return query$(`${itemType}.selected`)[0];
  }

  function greyMenuItem(greyArr, isGrey) {
    const menu = MENU.children[2];

    greyArr.ascEach((itemNum) => {
      menu.children[itemNum].toggleClass('grey-item', isGrey);
    });
  }

  function hideMenu(isHideCover) {
    MENU.fadeOut();

    // reset window width and height
    // because they may be changed when displaying menu
    modBodyWidth(getNowWidth());
    modBodyHeight(getMaxHeight());

    if (isHideCover !== false) {
      EDITOR.fadeOut();
      MENU_COVER.fadeOut(focusSearchInput);
      TARGET_ITEM.removeClass('selected');
    }
  }

  function initBookmarkEvent() {
    const createElementInDom = (id, info) => {
      const boxNum = BOX_PID.indexOf(info.parentId);

      // if parent box exists
      if (boxNum >= 0) {
        removeNoBkmark(boxNum);

        genItem(boxNum, info)
          .after(getRootFolderNum(boxNum) + info.index - 1);

        setHeight(boxNum);
      }
    };

    const removeElementFromDom = (id) => {
      const removedElement = id$(id);

      let boxNum;

      if (COPY_CUT_ITEM.id === id) {
        COPY_CUT_ITEM.id = null;
      }

      if (removedElement) {
        boxNum = getParentBoxNum(removedElement);

        // if this bookmark is folder, remove its sub tree from DOM
        if (BOX_PID.includes(id)) {
          resetBox(boxNum);
        }

        removedElement.remove();
        insertNoBkmark(boxNum);

        setHeight(boxNum);
      }
    };

    _bookmark.onChanged.addListener((id, info) => {
      const changedItem = id$(id);
      const title = info.title;
      const url = info.url;

      let nextBoxNum;

      if (changedItem) {
        if (!url) {
          nextBoxNum = getParentBoxNum(changedItem) + 1;
          updateBoxHeadTitle(nextBoxNum, title);
        } else if (url !== SEPARATE_THIS) {
          setTooltip(changedItem, title, url);
        }

        setItemText(changedItem, title, url);
      }
    });

    _bookmark.onCreated.addListener(createElementInDom);

    _bookmark.onMoved.addListener((id) => {
      _bookmark.get(id, (node) => {
        removeElementFromDom(id);
        createElementInDom(id, node[0]);
      });
    });

    _bookmark.onRemoved.addListener(removeElementFromDom);
  }

  function initEditor() {
    const editorButton = EDITOR.tag$('button');

    // confirm editing
    editorButton[0]
      .addText(_getMsg('confirm'))
      .clickByButton(0, () => {
        const editorInput = EDITOR.tag$('input');

        const title = editorInput[0].value;

        let url;

        if (EDITOR_CREATE) {
          createItemByMenuIntoView(title);
        } else {
          if (!isFolderItem(TARGET_ITEM)) {
            url = editorInput[1].value;
          }

          _bookmark.update(TARGET_ITEM.id, {
            title: title,
            url: url
          });
        }

        hideMenu();
      });

    // cancel editing
    editorButton[1]
      .addText(_getMsg('cancel'))
      .clickByButton(0, hideMenu);

    // type 'Enter' on input tag
    EDITOR.on('keydown', (event) => {
      if (event.keyCode === 13) {
        editorButton[0].click();
      }
    });
  }

  function initSearch() {
    SEARCH_INPUT
      .prop('placeholder', _getMsg('search'))
      .on('input', () => {
        // to avoid searching when user is still typing
        initTimeout('search', searchHandler, 200);
      });

    // hack to stimulate autofocus because it can't be used with tabIndex="-1"
    window.once('resize', focusSearchInput);
  }

  function initStyleOptions() {
    // if the font family's name has whitespace, use quote to embed it
    const fontFamily = STORAGE.fontFamily.split(',')
      .map((x) => {
        x = x.trim();

        if (x.includes(' ')) {
          x = `"${x}"`;
        }

        return x;
      })
      .join(',');

    const fontSizePx = STORAGE.fontSize + 'px';

    // -2 for border width
    const separatorHeightPx = (ITEM_HEIGHT / 2) - 2 + 'px';

    // set panel(#main, #sub) width
    CSS.set('.panel-width', {
      width: STORAGE.setWidth + 'px'
    });

    // set font style
    CSS.set('body', {
      font: fontSizePx + ' ' + fontFamily
    });

    if (STORAGE.fontSize > 16) {
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

  function insertNoBkmark(boxNum) {
    const boxList = getBoxList(boxNum);
    const noBkmark = !IS_SEARCHING ? NOBKMARK : NORESULT;

    if (boxList.children.length === getRootFolderNum(boxNum)) {
      noBkmark.cloneTo(boxList);
    }
  }

  function isFolderItem(item) {
    return item.data(DATATEXT_BOOKMARK_TYPE) === 'folder';
  }

  function isItem(element) {
    return element.hasClass('item');
  }

  function isItemInView(item) {
    const itemBottomOffsetTop = item.offsetTop + item.offsetHeight;
    const itemParent = item.parentNode;

    const parentScrollTop = itemParent.scrollTop;

    return itemBottomOffsetTop > parentScrollTop &&
      itemParent.offsetHeight + parentScrollTop >= itemBottomOffsetTop;
  }

  function isMenuCovered() {
    return !MENU_COVER.hidden;
  }

  function isRootFolder(item) {
    return item.hasClass('rootfolder');
  }

  function loadLastPos() {
    if (STORAGE.rememberPos) {
      LAST_BOX_PID.ascEach((folderId, boxNum) => {
        const fnAfterOpen = () => {
          const lastScrollTop = LAST_SCROLL_TOP[boxNum];

          if (lastScrollTop) {
            getBoxList(boxNum).scrollTop = lastScrollTop;
          }
        };

        if (boxNum === 0) {
          if (folderId === '' + STORAGE.defExpand) {
            fnAfterOpen();
          }
        } else {
          openFolder(folderId, fnAfterOpen);
        }
      });
    }
  }

  function menuEvent(event) {
    const target = event.target;
    const targetItemId = TARGET_ITEM.id;

    const menuItemNum = getMenuItemNum(target);

    switch (menuItemNum) {
      // open bookmarks in tab or win
      case 0:
      case 1:
      case 2:
        openBkmarks(targetItemId, isFolderItem(TARGET_ITEM), menuItemNum);
        break;

      case 3: // Edit... & Rename...
      case 9: // Add folder...
        EDITOR_CREATE = menuItemNum === 9;
        showEditor();
        return false;

      case 4: // Delete
        removeItem(targetItemId);
        break;

      case 5: // Cut
      case 6: // Copy
      case 7: // Paste
        if (target.hasClass('grey-item')) {
          return false;
        }

        if (menuItemNum === 7) {
          pasteItem(COPY_CUT_ITEM.id);
        } else {
          COPY_CUT_ITEM.isCut = menuItemNum === 5;
          COPY_CUT_ITEM.id = targetItemId;
        }
        break;

      case 8: // Add current page
        _tab.query({
          currentWindow: true,
          active: true
        }, (tab) => {
          createItemByMenuIntoView(tab[0].title, tab[0].url);
        });
        break;

      case 10: // Add separator
        createItemByMenuIntoView('- '.repeat(42), SEPARATE_THIS);
        break;

      case 11: // Sort by name
        sortByName(BOX_PID[getParentBoxNum(TARGET_ITEM)]);
        break;

      default:
        return false;
    }

    hideMenu();
  }

  function modBodyHeight(newHeight) {
    BODY.style.height = newHeight + 'px';
  }

  function modBodyWidth(newWidth) {
    BODY.style.width = newWidth + 'px';
  }

  function modMenuText(isFolder) {
    const menuItem = getMenuItem();
    const menuItemMsgName = isFolder ?
      ['openAll', 'openAllInN', 'openAllInI', 'rename'] :
      ['openInB', 'openInN', 'openInI', 'edit'];

    menuItemMsgName.ascEach((itemText, itemNum) => {
      menuItem[itemNum].innerText = _getMsg(itemText);
    });
  }

  function onHoverTimeout(element, fn, delay, xyRange = 20, isInsideRange = true) {
    const mousemoveFn = (mouseXYOrig) => {
      const isTriggerPoint = (axis) => {
        const displacement = Math.abs(mouseXY[axis] - mouseXYOrig[axis]);

        return displacement < xyRange === isInsideRange;
      };

      eventTimer = setTimeout(() => {
        if (document.contains(element)) {
          if (isInsideRange ?
                isTriggerPoint(0) && isTriggerPoint(1) :
                isTriggerPoint(0) || isTriggerPoint(1)) {
            fn(event);
            eventTimer = null;
          } else {
            mousemoveFn(mouseXY);
          }
        }
      }, delay);
    };

    let eventTimer;
    let mouseXY;

    element.on({
      mousemove(event) {
        mouseXY = [event.x, event.y];
        if (!eventTimer) {
          mousemoveFn(mouseXY);
        }
      },
      mouseout() {
        clearTimeout(eventTimer);
        eventTimer = null;
      }
    });
  }

  function openBkmarks(targetId, isFolder, menuItemNum) {
    const getBookmark = isFolder ? _bookmark.getSubTree : _bookmark.get;

    getBookmark(targetId, (node) => {
      const urlList = [];

      if (isFolder) {
        node[0].children.ascEach((itemInfo) => {
          const url = itemInfo.url;

          if (url && url !== SEPARATE_THIS) {
            urlList.push(url);
          }
        });

        if (STORAGE.warnOpenMany &&
            urlList.length > 5 &&
            !confirm(_getMsg('askOpenAll', '' + urlList.length))) {
          return false;
        }
      } else {
        urlList.push(node[0].url);
      }

      if (menuItemNum === 0) {
        urlList.ascEach((url) => {
          _tab.create({
            url: url,
            active: false
          });
        });
      } else {
        _win.create({
          url: urlList,
          incognito: menuItemNum !== 1
        });
      }

      window.close();
    });
  }

  function openFolder(id, fnAfterOpen) {
    if (BOX_PID.includes(id)) {
      if (fnAfterOpen) {
        fnAfterOpen();
      }
      return false;
    }

    _bookmark.getChildren(id, (treeInfo) => {
      if (treeInfo === undefined) {
        return false;
      }

      const folderItem = id$(id);

      const boxNum = getParentBoxNum(folderItem);

      const nextBoxNum = boxNum + 1;
      const prevBoxNum = boxNum - 1;

      genBox(nextBoxNum, id);

      updateBoxHeadTitle(nextBoxNum, folderItem.innerText);

      genList(nextBoxNum, treeInfo);

      if (boxNum > 0 && prevBoxNum >= NINJA_LIST.length) {
        const folderCoverFn = () => {
          resetBox(prevBoxNum);
        };

        const folderCover = genNinja(prevBoxNum)
          .on('click', folderCoverFn);

        if (!STORAGE.opFolderBy) {
          onHoverTimeout(folderCover, folderCoverFn, 300);
        }
      }

      setTimeout(() => {
        expandWidth(true);
      }, 50);

      if (fnAfterOpen) {
        fnAfterOpen();
      }
    });
  }

  function openOptionsPage() {
    _tab.create({url: 'options.html'});
  }

  function pasteItem(itemId) {
    if (COPY_CUT_ITEM.isCut) {
      const boxNum = getParentBoxNum(TARGET_ITEM);

      _bookmark.move(itemId, {
        parentId: BOX_PID[boxNum],
        index: getItemIndex(TARGET_ITEM)
      });
    } else {
      _bookmark.getSubTree(itemId, (treeInfo) => {
        const branchInfo = treeInfo[0];

        const copyChildFn = (folderList, folderId) => {
          folderList.children.ascEach((bkmark) => {
            _bookmark.create({
              parentId: folderId,
              title: bkmark.title,
              url: bkmark.url
            }, (itemInfo) => {
              if (!bkmark.url) {
                copyChildFn(bkmark, itemInfo.id);
              }
            });
          });
        };

        createItemByMenu(branchInfo.title, branchInfo.url, (itemInfo) => {
          if (!itemInfo.url) {
            copyChildFn(itemInfo, itemInfo.id);
          }
        });
      });
    }
  }

  function removeItem(itemId) {
    const isFolder = isFolderItem(id$(itemId));

    if (isFolder) {
      _bookmark.removeTree(itemId);
    } else {
      _bookmark.remove(itemId);
    }
  }

  function removeNoBkmark(boxNum) {
    const boxList = getBoxList(boxNum);
    const noBkmarkClassName = !IS_SEARCHING ? 'no-bkmark' : 'no-result';

    const noBkmark = boxList.class$(noBkmarkClassName)[0];

    if (noBkmark) {
      noBkmark.remove();
    }
  }

  function resetBox(level) {
    if (!IS_SEARCHING && level === BOX.length - 1) { // if no next list
      return false;
    }

    if (level === 0) {
      expandWidth(false);
    }

    NINJA_LIST.descEach(() => {
      NINJA_LIST.pop().fadeOut(true);
    }, level - 1);

    BOX.descEach(() => {
      BOX.pop().fadeOut(true);
      BOX_PID.pop();
      HEIGHT_LIST.pop();
    }, level + 1);

    savLastPID();
    savLastScroll();

    modBodyHeight(getMaxHeight());
  }

  function savLastPID() {
    if (STORAGE.rememberPos) {
      JSONStorage.set(NAME_LAST_BOX_PID, BOX_PID);
    }
  }

  function savLastScroll(isDelaySave) {
    if (STORAGE.rememberPos) {
      const saveFn = () => {
        JSONStorage.set(NAME_LAST_SCROLL_TOP, getLastScrollTop());
      };

      if (isDelaySave) {
        initTimeout(NAME_LAST_SCROLL_TOP, saveFn, 200);
      } else {
        saveFn();
      }
    }
  }

  function searchHandler() {
    const keyword = SEARCH_INPUT.value;

    if (keyword === '') {
      searchSwitch(false);
      return false;
    }

    if (!IS_SEARCHING) {
      searchSwitch(true);
    }

    _bookmark.search(keyword, (results) => {
      const boxList = getBoxList(0);
      const sortedResult = sortByTitle(searchResultSelector(results));

      removeNoBkmark(0);

      update$(boxList, sortedResult, (item) => {
        genItem(0, item).draggable = false;
      });
      insertNoBkmark(0);

      // scroll back to the top
      boxList.scrollTop = 0;

      setHeight(0);
    });
  }

  function searchResultSelector(results) {
    const isOnlySearchTitle = STORAGE.searchTarget === 1;
    const newResults = [];
    const splittedKeyArr = [];

    if (isOnlySearchTitle) {
      SEARCH_INPUT.value.split(' ').ascEach((splittedKey) => {
        if (splittedKey !== '') {
          splittedKeyArr.push(splittedKey.toLowerCase());
        }
      });
    }

    results.ascEach((bkmark) => {
      const bkmarkTitle = bkmark.title.toLowerCase();
      const bkmarkUrl = bkmark.url;

      let isntTitleMatched;

      if (bkmarkUrl && bkmarkUrl !== SEPARATE_THIS) {
        if (isOnlySearchTitle) {
          splittedKeyArr.ascEach((splittedKey) => {
            if (!bkmarkTitle.includes(splittedKey)) {
              isntTitleMatched = true;
              return false;
            }
          });

          if (isntTitleMatched) {
            return true;
          }
        }

        newResults.push(bkmark);
        if (newResults.length === STORAGE.maxResults) {
          return false;
        }
      }
    });

    return newResults;
  }

  function searchSwitch(isStartSearch) {
    IS_SEARCHING = isStartSearch;

    if (isStartSearch) {
      if (STORAGE.rememberPos) {
        LAST_BOX_PID = BOX_PID.slice();
        LAST_SCROLL_TOP = getLastScrollTop();
      }
      resetBox(0);
    } else {
      genFirstBox();
    }
  }

  function setBottomRight(settler, bottomValue, rightValue) {
    settler.css({
      bottom: Math.max(bottomValue, 0) + 'px',
      right: Math.max(rightValue, 0) + 'px'
    });
  }

  function setEditorPos() {
    const targetOffsetTop = TARGET_ITEM.getBoundingClientRect().top;

    EDITOR.hidden = false;
    setBottomRight(
      EDITOR,
      getNowHeight() - EDITOR.offsetHeight - targetOffsetTop,
      getParentBoxNum(TARGET_ITEM) % 2 ? STORAGE.setWidth + GOLDEN_GAP : 0
    );
  }

  function setEditorText(title, url) {
    const editorTitle = _getMsg(url ? 'edit' : 'rename').replace('...', '');
    const inputField = EDITOR.tag$('input');

    const titleField = inputField[0];
    const urlField = inputField[1];

    id$('edit-title').innerText = editorTitle;

    titleField.value = title;
    urlField.value = url;

    titleField.selectText().focus();
    urlField.hidden = !url;
  }

  function setHeight(boxNum) {
    const boxList = getBoxList(boxNum);

    const boxListOffsetTop = boxList.getBoundingClientRect().top;

    const maxListHeight = MAX_HEIGHT - boxListOffsetTop;

    const listHeight = Math.min(boxList.scrollHeight, maxListHeight);

    const bodyHeight = listHeight + boxListOffsetTop;

    boxList.style.maxHeight = listHeight + 'px';

    HEIGHT_LIST[boxNum] = Math.min(bodyHeight, MAX_HEIGHT);
    modBodyHeight(getMaxHeight());
  }

  function setItemText(item, title, url) {
    item.last().innerText = title || url || '';
  }

  function setMenuPos(mouseX, mouseY) {
    const menuHeight = MENU.offsetHeight;
    const menuWidth = MENU.offsetWidth;
    const nowHeight = getNowHeight();

    if (menuHeight > nowHeight) {
      modBodyHeight(menuHeight);
    }

    if (menuWidth > BODY.offsetWidth) {
      modBodyWidth(menuWidth);
    }

    setBottomRight(
      MENU,
      nowHeight - menuHeight - mouseY,
      getNowWidth() - menuWidth - mouseX
    );
  }

  function setTooltip(item, title, url) {
    const tooltipArr = [];

    if (STORAGE.tooltip) {
      tooltipArr.push(title, url);
    }

    if (IS_SEARCHING) {
      const breadcrumbArr = [];

      const getBreadcrumb = (breadId) => {
        _bookmark.get(breadId, (node) => {
          if (node === undefined) {
            return false;
          }

          const itemInfo = node[0];

          if (![item.id, '0'].includes(itemInfo.id)) {
            breadcrumbArr.unshift(itemInfo.title);
          }

          if (itemInfo.parentId !== undefined) {
            getBreadcrumb(itemInfo.parentId);
          } else {
            tooltipArr.unshift(breadcrumbArr.join(' > '));
            item.title = tooltipArr.join('\n');
          }
        });
      };

      getBreadcrumb(item.id);
    } else if (tooltipArr.length > 0) {
      item.title = tooltipArr.join('\n');
    }
  }

  function showEditor() {
    hideMenu(false);

    if (EDITOR_CREATE) {
      setEditorText(_getMsg('newFolder'));
      setEditorPos();
    } else {
      _bookmark.get(TARGET_ITEM.id, (node) => {
        setEditorText(node[0].title, node[0].url);
        setEditorPos();
      });
    }
  }

  function sortByName(parentId) {
    _bookmark.getChildren(parentId, (childList) => {
      const separatedChildList = [];

      const genBkmarkList = () => {
        const newBkmarkList = [
          [/* Separators */],
          [/* Folders */],
          [/* Bookmarks */]
        ];

        separatedChildList.push(newBkmarkList);

        return newBkmarkList;
      };

      let newChildList = [];
      let selectedChildList = genBkmarkList();

      /**
       * Split all bookmarks into n main group,
       * where n = the number of separators + 1
       * Each main group contains 3 small groups
       * (Separators, Folders, Bookmarks)
       */
      childList.ascEach((bkmark) => {
        const url = bkmark.url;

        let selectedBkmarkListNum;

        if (url) {
          if (url !== SEPARATE_THIS) {
            // Bookmarks
            selectedBkmarkListNum = 2;
          } else {
            //  Separators
            selectedBkmarkListNum = 0;
            selectedChildList = genBkmarkList();
          }
        } else {
          // Folders
          selectedBkmarkListNum = 1;
        }

        selectedChildList[selectedBkmarkListNum].push(bkmark);
      });

      // Concatenate all lists into single list
      separatedChildList.ascEach((thisSelectedChildList) => {
        thisSelectedChildList.ascEach((bkmarkList) => {
          newChildList = newChildList.concat(sortByTitle(bkmarkList));
        });
      });

      // Sort bookmarks by Selection sort
      newChildList.ascEach((bkmark, index) => {
        const oldIndex = childList.indexOf(bkmark);

        if (oldIndex !== index) {
          childList.move(oldIndex, index);

          _bookmark.move(bkmark.id, {
            index: index + (index > oldIndex ? 1 : 0)
          });
        }
      });
    });
  }

  function sortByTitle(bkmarkList) {
    return bkmarkList.sort((bkmark1, bkmark2) => {
      return bkmark1.title.localeCompare(bkmark2.title);
    });
  }

  function updateBoxHeadTitle(boxNum, title) {
    const box = BOX[boxNum];

    if (box) {
      box.class$('head-title')[0].innerText = title;
    }
  }
});
