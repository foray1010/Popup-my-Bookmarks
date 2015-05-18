'use strict';
chrome.storage.sync.get(null, function(STORAGE) {
  // shorter global
  var _bookmark = chrome.bookmarks;
  var _getMsg = chrome.i18n.getMessage;
  var _tab = chrome.tabs;
  var _win = chrome.windows;

  var _indexOf = Array.prototype.indexOf;

  // options storage
  var BOOKMARKLET = STORAGE.bookmarklet;
  var DEF_EXPAND = STORAGE.defExpand;
  var FONT_SIZE = STORAGE.fontSize;
  var FONT_FAMILY = STORAGE.fontFamily;
  var HIDE_ROOT_FOLDER = STORAGE.hideRootFolder;
  var MAX_RESULTS = STORAGE.maxResults;
  var OP_FOLDER_BY = STORAGE.opFolderBy;
  var REMEMBER_POS = STORAGE.rememberPos;
  var SEARCH_TARGET = STORAGE.searchTarget;
  var SET_WIDTH = STORAGE.setWidth;
  var TOOLTIP = STORAGE.tooltip;
  var WARN_OPEN_MANY = STORAGE.warnOpenMany;

  // local storage
  // name
  var NAME_LAST_BOX_PID = 'lastBoxPID';
  var NAME_LAST_SCROLL_TOP = 'lastScrollTop';
  // value
  var LAST_BOX_PID = jsonStorage('get', NAME_LAST_BOX_PID) || [];
  var LAST_SCROLL_TOP = jsonStorage('get', NAME_LAST_SCROLL_TOP) || [];

  // pre-defined
  var BOX = [];
  var BOX_PID = []; //store the parentId of each box
  var COPY_CUT_ITEM = {
    id: null,
    isCut: false
  };
  var DRAG_ITEM = null;
  var DRAG_TIMEOUT;
  var EDITOR_CREATE;
  var GOLDEN_GAP = 2;
  var HEIGHT_LIST = [];
  var HOVER_TIMEOUT;
  var IS_EXPANDED = false;
  var IS_SEARCHING = false;
  var MAX_HEIGHT = 596;
  var MENU_PATTERN = [
    '', '', '', '|',
    '', 'del', '|',
    'cut', 'copy', 'paste', '|',
    'addPage', 'addFolder', 'addSeparator', '|',
    'sortByName'
  ];
  var NINJA_LIST = [];
  var ON_MOD_KEY;
  var SEPARATE_THIS = 'http://separatethis.com/';
  var TARGET_ITEM;

  // +2 for border width, GOLDEN_GAP*2 for padding
  var ITEM_HEIGHT = 2 + GOLDEN_GAP * 2 + [FONT_SIZE, 16].max();

  // attr: data's text
  var DATATEXT_BOX_NUM = 'boxNum';
  var DATATEXT_BOOKMARK_TYPE = 'bookmark_type';

  // HTML element
  var BODY = document.body;
  var CONTAINER = [id$('main'), id$('sub')];
  var DRAG_PLACE = id$('drag-place');
  var EDITOR = id$('editor');
  var MENU = id$('menu');
  var MENU_COVER = id$('menu-cover');
  var PRELOAD = id$('preload');
  var SEARCH_INPUT = id$('search-input');

  // preload
  var BOX_TEMPLATE = PRELOAD.class$('box-template')[0];
  var ITEM = PRELOAD.class$('item')[0];
  var NOBKMARK = PRELOAD.class$('no-bkmark')[0]
    .data(DATATEXT_BOOKMARK_TYPE, 'no-bkmark')
    .addText(_getMsg('noBkmark'));
  var NORESULT = PRELOAD.class$('no-result')[0].addText(_getMsg('noResult'));

  // if first run
  if (HIDE_ROOT_FOLDER === undefined) {
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
    click: function(event) {
      var item;
      var mouseButton = event.button;
      var target = event.target;

      // reset the cursor to search-input after clicking
      focusSearchInput();

      if (target.hvClass('head-close')) {
        resetBox(target.parentNode.next().data(DATATEXT_BOX_NUM) - 1);

        return true;
      }

      item = getItem(target);
      if (item) {
        switch (item.data(DATATEXT_BOOKMARK_TYPE)) {
          case 'folder':
            if (mouseButton === 1) {
              openBkmarks(item.id, true, 0);
            } else if (OP_FOLDER_BY) {
              if (!BOX_PID.hv(item.id)) {
                openFolder(item.id);
              } else {
                resetBox(getParentBoxNum(item));
              }
            }
            break;

          case 'bkmark':
            _bookmark.get(item.id, function(node) {
              clickSwitcher(mouseButton, node[0].url);
            });
        }
      }
    },
    // Customize right click menu
    contextmenu: function(event) {
      var hideParam;
      var item;
      var target = event.target;

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
      MENU.children.ascEach(function(menuItem, itemNum) {
        menuItem.hidden = hideParam[itemNum];
      });

      modMenuText(isFolderItem(item));

      greyMenuItem([0, 1], item.id === '');
      greyMenuItem([2], COPY_CUT_ITEM.id === null);

      MENU_COVER.show();
      MENU.show();

      TARGET_ITEM = item;
      setMenuPos(event.x, event.y);
    },
    dragend: dragEndEvent,
    dragover: dragOverEvent,
    dragstart: dragStartEvent,
    keydown: function(event) {
      var keyCode = event.keyCode;

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
    keyup: function(event) {
      if (event.keyCode === ON_MOD_KEY) {
        ON_MOD_KEY = null;
      }
    },
    // disable the scrolling arrows after middle click
    mousedown: function(event) {
      if (event.button === 1) {
        event.preventDefault();
      }
    },
    mouseout: function(event) {
      var item = getItem(event.target);

      if (item) {
        clearTimeout(HOVER_TIMEOUT);

        // if menu is displayed, bookmark item should keep selected
        if (!isMenuCovered() || item.hvClass('menu-item')) {
          item.rmClass('selected');
        }
      }
    },
    mouseover: function(event) {
      var item = getItem(event.target);
      var selectedItem;

      if (item) {
        HOVER_TIMEOUT = setTimeout(function() {
          if (!OP_FOLDER_BY) {
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
          selectedItem.rmClass('selected');
        }

        if (!item.hvClass('grey-item')) {
          item.addClass('selected');
        }
      }
    }
  });

  // functions
  function arrowLeftRightHandler(isLeft) {
    if (isMenuCovered()) {
      return false;
    }

    var selectIndex = 0;
    var selectedItem = getSelectedItem();

    var boxNum = getParentBoxNum(selectedItem);
    var prevBoxNum = boxNum - 1;

    var moveSelectedToBox = function(thisBoxNum) {
      selectedItem.rmClass('selected');
      getBoxList(thisBoxNum).children[selectIndex].addClass('selected');
    };

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
          openFolder(selectedItem.id, function() {
            moveSelectedToBox(boxNum + 1);
          });
        }
      }
    }
  }

  function arrowUpDownHandler(isDown) {
    var itemList;
    var itemParent;
    var selectedItem = getSelectedItem();

    var lastItemIndex;
    var nextSelectedIndex;
    var nextSelectedItem;
    var origSelectedIndex;

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
      selectedItem.rmClass('selected');
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
    var switcher;
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
          if (BOOKMARKLET) {
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
    var boxNum = getParentBoxNum(TARGET_ITEM);

    _bookmark.create({
      parentId: BOX_PID[boxNum],
      title: title,
      url: url,
      index: getItemIndex(TARGET_ITEM)
    }, afterFn);
  }

  function createItemByMenuIntoView(title, url) {
    createItemByMenu(title, url, function(itemInfo) {
      var item = id$(itemInfo.id);
      if (!isItemInView(item)) {
        item.scrollIntoView(false);
      }
    });
  }

  function dragEndEvent(event) {
    if (DRAG_ITEM) {
      clearTimeout(DRAG_TIMEOUT);

      // remove DRAG_ITEM from PRELOAD
      DRAG_ITEM.remove();
      DRAG_ITEM = null;

      // move the dragged item to the location of DRAG_PLACE
      if (DRAG_PLACE.parentNode !== PRELOAD) {
        var target = event.target;
        var bkmarkIndex = getItemIndex(DRAG_PLACE) - 1;
        var boxNum = getParentBoxNum(DRAG_PLACE);

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
    var item = getItem(event.target);

    if (item && DRAG_ITEM) {
      DRAG_TIMEOUT = initTimeout('drag', function() {
        var boxNum = getParentBoxNum(item);
        var isPlaceBefore = event.offsetY < item.offsetHeight / 2;
        var isntDragItem = item.id !== DRAG_ITEM.id;
        var origBoxNum = getParentBoxNum(DRAG_PLACE);

        var itemSibling = item[isPlaceBefore ? 'prev' : 'next']();

        var isntDragItemSibling = !itemSibling ||
                                  itemSibling.id !== DRAG_ITEM.id;

        if (isntDragItem &&
            isntDragItemSibling &&
            !isRootFolder(item)) {
          DRAG_PLACE[isPlaceBefore ? 'before' : 'after'](item);
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
      }, 70);
    }
  }

  function dragStartEvent(event) {
    var boxNum;
    var target = event.target;

    if (isItem(target)) {
      DRAG_ITEM = target;

      boxNum = getParentBoxNum(target);
      // if there is next box
      if (boxNum === BOX.length) {
        genNinja(boxNum).hide();
        genNinja(boxNum + 1);
      }

      // hack to prevent dragover and dragend event stop working
      setTimeout(function() {
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
    var selectedItem = getSelectedItem();

    if (selectedItem) {
      selectedItem.click();
    } else if (IS_SEARCHING) {
      // enter the first bkmark when press return key
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
    if (!isMenuCovered() && !SEARCH_INPUT.hvFocus()) {
      SEARCH_INPUT.focus();
    }
  }

  function genBox(boxNum, boxPid) {
    var box = BOX_TEMPLATE.cloneTo(CONTAINER[boxNum % 2]);

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
        mousewheel: function(event) {
          event.preventDefault();

          // control scrolling speed
          this.scrollTop -= ITEM_HEIGHT * event.wheelDelta / 120 >> 0;
        },
        scroll: function() {
          savLastScroll(true);
        }
      });

    return box;
  }

  function genFirstBox() {
    // remove headbox
    genBox(0, DEF_EXPAND + '').first().remove();

    genFirstList();
  }

  function genFirstList() {
    _bookmark.getChildren('0', function(rootTreeInfo) {
      rootTreeInfo.ascEach(function(stem) {
        var stemId = stem.id * 1;
        if (stemId === DEF_EXPAND ||
            HIDE_ROOT_FOLDER.hv(stemId)) {
          return true;
        }
        genItem(0, stem).addClass('rootfolder').draggable = false;
      });

      _bookmark.getChildren(DEF_EXPAND + '', function(treeInfo) {
        genList(0, treeInfo);

        loadLastPos();
      });
    });
  }

  function genItem(boxNum, itemInfo) {
    var newItem = ITEM.cloneTo(getBoxList(boxNum)).prop('id', itemInfo.id);

    var icon = newItem.first();
    var title = itemInfo.title;
    var url = itemInfo.url;

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
    treeInfo.ascEach(function(itemInfo) {
      genItem(boxNum, itemInfo);
    });
    insertNoBkmark(boxNum);

    setHeight(boxNum);
  }

  function genMenu() {
    var area = MENU.new$('div');

    MENU_PATTERN.ascEach(function(menuItemText) {
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
    return NINJA_LIST[boxNum] = BOX[boxNum].new$('div').addClass('ninja');
  }

  function getBoxList(boxNum) {
    return BOX[boxNum].class$('folderlist')[0];
  }

  function getItem(element) {
    var item;
    var itemParent = element.parentNode;

    if (isItem(element)) {
      item = element;
    } else if (isItem(itemParent)) {
      item = itemParent;
    }

    return item;
  }

  function getItemIndex(item) {
    return item.hvClass('no-bkmark') ? 0 :
      item.index() + 1 - getRootFolderNum(getParentBoxNum(item));
  }

  function getLastScrollTop() {
    var lastScrollTop = [];
    BOX.ascEach(function(box, boxNum) {
      lastScrollTop[boxNum] = getBoxList(boxNum).scrollTop;
    });
    return lastScrollTop;
  }

  function getMaxHeight() {
    return HEIGHT_LIST.max();
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
    return IS_EXPANDED ? SET_WIDTH * 2 + GOLDEN_GAP : SET_WIDTH;
  }

  function getParentBoxNum(item) {
    return item.parentNode.data(DATATEXT_BOX_NUM) * 1;
  }

  function getRootFolderNum(boxNum) {
    return getBoxList(boxNum).class$('rootfolder').length;
  }

  function getSelectedItem() {
    var itemType = !isMenuCovered() ? '.bookmark-item' : '.menu-item';

    return query$(itemType + '.selected')[0];
  }

  function greyMenuItem(greyArr, isGrey) {
    var menu = MENU.children[2];
    greyArr.ascEach(function(itemNum) {
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
      TARGET_ITEM.rmClass('selected');
    }
  }

  function initBookmarkEvent() {
    var createElementInDom = function(id, info) {
      var boxNum = BOX_PID.indexOf(info.parentId);

      // if parent box exists
      if (boxNum >= 0) {
        removeNoBkmark(boxNum);

        genItem(boxNum, info)
          .after(getRootFolderNum(boxNum) + info.index - 1);

        setHeight(boxNum);
      }
    };

    var removeElementFromDom = function(id) {
      var boxNum;
      var removedElement = id$(id);

      if (COPY_CUT_ITEM.id === id) {
        COPY_CUT_ITEM.id = null;
      }

      if (removedElement) {
        boxNum = getParentBoxNum(removedElement);

        // if this bookmark is folder, remove its sub tree from DOM
        if (BOX_PID.hv(id)) {
          resetBox(boxNum);
        }

        removedElement.remove();
        insertNoBkmark(boxNum);

        setHeight(boxNum);
      }
    };

    _bookmark.onChanged.addListener(function(id, info) {
      var changedItem = id$(id);
      var nextBoxNum;
      var title = info.title;
      var url = info.url;

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

    _bookmark.onMoved.addListener(function(id) {
      _bookmark.get(id, function(node) {
        removeElementFromDom(id);
        createElementInDom(id, node[0]);
      });
    });

    _bookmark.onRemoved.addListener(removeElementFromDom);
  }

  function initEditor() {
    var editorButton = EDITOR.tag$('button');

    // confirm editing
    editorButton[0]
      .addText(_getMsg('confirm'))
      .clickByButton(0, function() {
        var editorInput = EDITOR.tag$('input');
        var url;

        var title = editorInput[0].value;

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
    EDITOR.on('keydown', function(event) {
      if (event.keyCode === 13) {
        editorButton[0].click();
      }
    });
  }

  function initSearch() {
    SEARCH_INPUT
      .prop('placeholder', _getMsg('search'))
      .on('input', function() {
        // to avoid searching when user is still typing
        initTimeout('search', searchHandler, 200);
      });

    // hack to stimulate autofocus because it can't be used with tabIndex="-1"
    window.once('resize', focusSearchInput);
  }

  function initStyleOptions() {
    var fontSizePx = FONT_SIZE + 'px';
    // -2 for border width
    var separatorHeightPx = (ITEM_HEIGHT / 2) - 2 + 'px';

    // if the font family's name has whitespace, use quote to embed it
    var fontFamily = FONT_FAMILY.split(',')
      .map(function(x) {
        x = x.trim();
        if (x.hv(' ')) {
          x = '"' + x + '"';
        }
        return x;
      })
      .join(',');

    // set panel(#main, #sub) width
    CSS.set('.panel-width', {
      'width': SET_WIDTH + 'px'
    });

    // set font style
    CSS.set('body', {
      'font': fontSizePx + ' ' + fontFamily
    });

    if (FONT_SIZE > 16) {
      CSS.set({
        '.bookmark-item': {
          'height': fontSizePx,
          'line-height': fontSizePx
        },
        '.icon': {
          'width': fontSizePx
        }
      });
    }

    // set separator height depend on item height
    CSS.set('.separator', {
      'height': separatorHeightPx,
      'line-height': separatorHeightPx
    });
  }

  function insertNoBkmark(boxNum) {
    var boxList = getBoxList(boxNum);
    var noBkmark = !IS_SEARCHING ? NOBKMARK : NORESULT;

    if (boxList.children.length === getRootFolderNum(boxNum)) {
      noBkmark.cloneTo(boxList);
    }
  }

  function isFolderItem(item) {
    return item.data(DATATEXT_BOOKMARK_TYPE) === 'folder';
  }

  function isItem(element) {
    return element.hvClass('item');
  }

  function isItemInView(item) {
    var itemBottomOffsetTop = item.offsetTop + item.offsetHeight;
    var itemParent = item.parentNode;

    var parentScrollTop = itemParent.scrollTop;

    return itemBottomOffsetTop > parentScrollTop &&
      itemParent.offsetHeight + parentScrollTop >= itemBottomOffsetTop;
  }

  function isMenuCovered() {
    return !MENU_COVER.hidden;
  }

  function isRootFolder(item) {
    return item.hvClass('rootfolder');
  }

  function loadLastPos() {
    if (REMEMBER_POS) {
      LAST_BOX_PID.ascEach(function(folderId, boxNum) {
        var fnAfterOpen = function() {
          var lastScrollTop = LAST_SCROLL_TOP[boxNum];
          if (lastScrollTop) {
            getBoxList(boxNum).scrollTop = lastScrollTop;
          }
        };

        if (boxNum === 0) {
          if (folderId === DEF_EXPAND + '') {
            fnAfterOpen();
          }
        } else {
          openFolder(folderId, fnAfterOpen);
        }
      });
    }
  }

  function jsonStorage(action, name, value) {
    var _localStorage = localStorage;
    var _json = JSON;

    switch (action) {
      case 'get':
        return _json.parse(_localStorage.getItem(name));

      case 'set':
        _localStorage.setItem(name, _json.stringify(value));
    }
  }

  function menuEvent(event) {
    var target = event.target;
    var targetItemId = TARGET_ITEM.id;

    var menuItemNum = getMenuItemNum(target);

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
        if (target.hvClass('grey-item')) {
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
        }, function(tab) {
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
    var menuItem = getMenuItem();
    var menuItemMsgName = isFolder ?
      ['openAll', 'openAllInN', 'openAllInI', 'rename'] :
      ['openInB', 'openInN', 'openInI', 'edit'];

    menuItemMsgName.ascEach(function(itemText, itemNum) {
      menuItem[itemNum].innerText = _getMsg(itemText);
    });
  }

  function openBkmarks(targetId, isFolder, menuItemNum) {
    _bookmark[isFolder ? 'getSubTree' : 'get'](targetId, function(node) {
      var urlList = [];

      if (isFolder) {
        node[0].children.ascEach(function(itemInfo) {
          var url = itemInfo.url;
          if (url && url !== SEPARATE_THIS) {
            urlList.push(url);
          }
        });

        if (WARN_OPEN_MANY &&
            urlList.length > 5 &&
            !confirm(_getMsg('askOpenAll', urlList.length + ''))) {
          return false;
        }
      } else {
        urlList.push(node[0].url);
      }

      if (menuItemNum === 0) {
        urlList.ascEach(function(url) {
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
    if (BOX_PID.hv(id)) {
      if (fnAfterOpen) {
        fnAfterOpen();
      }
      return false;
    }

    _bookmark.getChildren(id, function(treeInfo) {
      if (treeInfo === undefined) {
        return false;
      }

      var folderCover;
      var folderCoverFn;
      var folderItem = id$(id);

      var boxNum = getParentBoxNum(folderItem);

      var nextBoxNum = boxNum + 1;
      var prevBoxNum = boxNum - 1;

      genBox(nextBoxNum, id);

      updateBoxHeadTitle(nextBoxNum, folderItem.innerText);

      genList(nextBoxNum, treeInfo);

      if (boxNum > 0 && prevBoxNum >= NINJA_LIST.length) {
        folderCoverFn = function() {
          resetBox(prevBoxNum);
        };

        folderCover = genNinja(prevBoxNum)
          .on('click', folderCoverFn);

        if (!OP_FOLDER_BY) {
          folderCover.hoverTimeout(folderCoverFn, 300, 20);
        }
      }

      setTimeout(function() {
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
      var boxNum = getParentBoxNum(TARGET_ITEM);
      _bookmark.move(itemId, {
        parentId: BOX_PID[boxNum],
        index: getItemIndex(TARGET_ITEM)
      });
    } else {
      _bookmark.getSubTree(itemId, function(treeInfo) {
        var copyChildFn = function(folderList, folderId) {
          folderList.children.ascEach(function(bkmark) {
            _bookmark.create({
              parentId: folderId,
              title: bkmark.title,
              url: bkmark.url
            }, function(itemInfo) {
              if (!bkmark.url) {
                copyChildFn(bkmark, itemInfo.id);
              }
            });
          });
        };

        var itemInfo = treeInfo[0];

        createItemByMenu(itemInfo.title, itemInfo.url, function(itemInfo) {
          if (!itemInfo.url) {
            copyChildFn(itemInfo, itemInfo.id);
          }
        });
      });
    }
  }

  function removeItem(itemId) {
    var isFolder = isFolderItem(id$(itemId));
    _bookmark[isFolder ? 'removeTree' : 'remove'](itemId);
  }

  function removeNoBkmark(boxNum) {
    var boxList = getBoxList(boxNum);
    var noBkmarkClassName = !IS_SEARCHING ? 'no-bkmark' : 'no-result';

    var noBkmark = boxList.class$(noBkmarkClassName)[0];

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

    NINJA_LIST.descEach(function() {
      NINJA_LIST.pop().fadeOut(true);
    }, level - 1);

    BOX.descEach(function() {
      BOX.pop().fadeOut(true);
      BOX_PID.pop();
      HEIGHT_LIST.pop();
    }, level + 1);
    savLastPID();
    savLastScroll();

    modBodyHeight(getMaxHeight());
  }

  function savLastPID() {
    if (REMEMBER_POS) {
      jsonStorage('set', NAME_LAST_BOX_PID, BOX_PID);
    }
  }

  function savLastScroll(isDelaySave) {
    if (REMEMBER_POS) {
      var saveFn = function() {
        jsonStorage('set', NAME_LAST_SCROLL_TOP, getLastScrollTop());
      };

      if (isDelaySave) {
        initTimeout(NAME_LAST_SCROLL_TOP, saveFn, 200);
      } else {
        saveFn();
      }
    }
  }

  function searchHandler() {
    var keyword = SEARCH_INPUT.value;

    if (keyword === '') {
      searchSwitch(false);
      return false;
    }

    if (!IS_SEARCHING) {
      searchSwitch(true);
    }

    _bookmark.search(keyword, function(results) {
      var boxList = getBoxList(0);
      var sortedResult = sortByTitle(searchResultSelector(results));

      removeNoBkmark(0);

      update$(boxList, sortedResult, function(item) {
        genItem(0, item).draggable = false;
      });
      insertNoBkmark(0);

      // scroll back to the top
      boxList.scrollTop = 0;

      setHeight(0);
    });
  }

  function searchResultSelector(results) {
    var isOnlySearchTitle = SEARCH_TARGET === 1;
    var newResults = [];
    var splittedKeyArr = [];

    if (isOnlySearchTitle) {
      SEARCH_INPUT.value.split(' ').ascEach(function(splittedKey) {
        if (splittedKey !== '') {
          splittedKeyArr.push(splittedKey.toLowerCase());
        }
      });
    }

    results.ascEach(function(bkmark) {
      var bkmarkTitle;
      var bkmarkUrl = bkmark.url;
      var isntTitleMatched;

      if (bkmarkUrl && bkmarkUrl !== SEPARATE_THIS) {
        if (isOnlySearchTitle) {
          bkmarkTitle = bkmark.title.toLowerCase();
          splittedKeyArr.ascEach(function(splittedKey) {
            if (!bkmarkTitle.hv(splittedKey)) {
              isntTitleMatched = true;
              return false;
            }
          });

          if (isntTitleMatched) {
            return true;
          }
        }

        newResults.push(bkmark);
        if (newResults.length === MAX_RESULTS) {
          return false;
        }
      }
    });

    return newResults;
  }

  function searchSwitch(isStartSearch) {
    IS_SEARCHING = isStartSearch;

    if (isStartSearch) {
      if (REMEMBER_POS) {
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
      bottom: [bottomValue, 0].max() + 'px',
      right: [rightValue, 0].max() + 'px'
    });
  }

  function setEditorPos() {
    var targetOffsetTop = TARGET_ITEM.getBoundingClientRect().top;

    EDITOR.show();
    setBottomRight(
      EDITOR,
      getNowHeight() - EDITOR.offsetHeight - targetOffsetTop,
      getParentBoxNum(TARGET_ITEM) % 2 ? SET_WIDTH + GOLDEN_GAP : 0
    );
  }

  function setEditorText(title, url) {
    var editorTitle = _getMsg(url ? 'edit' : 'rename').replace('...', '');
    var inputField = EDITOR.tag$('input');

    id$('edit-title').innerText = editorTitle;
    inputField[0].val(title).selectText().focus();
    inputField[1].val(url).hidden = !url;
  }

  function setHeight(boxNum) {
    var boxList = getBoxList(boxNum);

    var bodyHeight;
    var boxListOffsetTop = boxList.getBoundingClientRect().top;
    var listHeight;

    var maxListHeight = MAX_HEIGHT - boxListOffsetTop;

    listHeight = [boxList.scrollHeight, maxListHeight].min();
    boxList.style.maxHeight = listHeight + 'px';

    bodyHeight = listHeight + boxListOffsetTop;
    HEIGHT_LIST[boxNum] = [bodyHeight, MAX_HEIGHT].min();
    modBodyHeight(getMaxHeight());
  }

  function setItemText(item, title, url) {
    item.last().innerText = title || url || '';
  }

  function setMenuPos(mouseX, mouseY) {
    var menuHeight = MENU.offsetHeight;
    var menuWidth = MENU.offsetWidth;
    var nowHeight = getNowHeight();

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
    var tooltipArr = [];

    if (TOOLTIP) {
      tooltipArr.push(title, url);
    }

    if (IS_SEARCHING) {
      var breadcrumbArr = [];
      var getBreadcrumb = function(breadId) {
        _bookmark.get(breadId, function(node) {
          if (node === undefined) {
            return false;
          }

          var itemInfo = node[0];

          if (![item.id, '0'].hv(itemInfo.id)) {
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
      _bookmark.get(TARGET_ITEM.id, function(node) {
        setEditorText(node[0].title, node[0].url);
        setEditorPos();
      });
    }
  }

  function sortByName(parentId) {
    _bookmark.getChildren(parentId, function(childList) {
      var genBkmarkList = function() {
        var newBkmarkList = [
          [/* Separators */],
          [/* Folders */],
          [/* Bookmarks */]
        ];
        separatedChildList.push(newBkmarkList);
        return newBkmarkList;
      };

      var newChildList = [];
      var separatedChildList = [];
      var selectedChildList = genBkmarkList();

      /**
       * Split all bookmarks into n main group,
       * where n = the number of separators + 1
       * Each main group contains 3 small groups
       * (Separators, Folders, Bookmarks)
       */
      childList.ascEach(function(bkmark) {
        var selectedBkmarkListNum;
        var url = bkmark.url;

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
      separatedChildList.ascEach(function(selectedChildList) {
        selectedChildList.ascEach(function(bkmarkList) {
          newChildList = newChildList.concat(sortByTitle(bkmarkList));
        });
      });

      // Sort bookmarks by Selection sort
      newChildList.ascEach(function(bkmark, index) {
        var oldIndex = childList.indexOf(bkmark);

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
    return bkmarkList.sort(function(bkmark1, bkmark2) {
      return bkmark1.title.localeCompare(bkmark2.title);
    });
  }

  function updateBoxHeadTitle(boxNum, title) {
    var box = BOX[boxNum];

    if (box) {
      box.class$('head-title')[0].innerText = title;
    }
  }
});
