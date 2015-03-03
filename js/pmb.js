'use strict';
chrome.storage.sync.get(null, function(STORAGE) {
  // shorter global
  var _bookmark = chrome.bookmarks;
  var _getMsg = chrome.i18n.getMessage;
  var _tab = chrome.tabs;
  var _win = chrome.windows;

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
  var HEIGHT_LIST = [];
  var HOVER_TIMEOUT;
  var IS_EXPANDED = false;
  var IS_SEARCHING = false;
  // +4 for padding, +2 for border width
  var ITEM_HEIGHT = [FONT_SIZE, 16].max() + 6;
  var MAX_HEIGHT = 596;
  var MENU_PATTERN = [
    '', '', '', '|',
    '', 'del', '|',
    'cut', 'copy', 'paste', '|',
    'addPage', 'addFolder', 'addSeparator', '|',
    'sortByName'
  ];
  var NINJA_LIST = [];
  var NOW_SCROLL_TOP = [];
  var ON_MOD_KEY;
  var SEPARATE_THIS = 'http://separatethis.com/';
  var TARGET_ITEM;

  // attr: data's text
  var DATATEXT_BOX_NUM = 'box_num';
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
      var mouse_button = event.button;
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
            if (mouse_button === 1) {
              openBkmarks(item.id, true, 0);
            } else if (OP_FOLDER_BY) {
              openFolder(item.id);
            }

            break;

          case 'bkmark':
            _bookmark.get(item.id, function(bkmark) {
              clickSwitcher(mouse_button, bkmark[0].url);
            });
        }
      }
    },
    // Customize right click menu
    contextmenu: function(event) {
      var hide_param;
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
          if (isRootFolder(target)) {
            hide_param = [false, true, true, true, true];
          } else if (!IS_SEARCHING) {
            hide_param = [false, false, false, false, false];
          } else {
            hide_param = [false, false, false, true, true];
          }

          break;

        case 'no-bkmark':
          hide_param = [true, true, false, false, true];
      }

      // set availability of menu items
      MENU.children.ascEach(function(menu_item, item_num) {
        menu_item.hidden = hide_param[item_num];
      });

      modMenuText(isFolder(target));

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
      var key_code = event.keyCode;
      switch (key_code) {
        case 13:
          if (IS_SEARCHING) {
            // enter the first bkmark when press return key
            getBoxList(0).first().click();
          }

          break;

        case 16: // shift
        case 17: // ctrl
          if (key_code !== ON_MOD_KEY) {
            ON_MOD_KEY = key_code;
          }

          break;

        // case 37: // left
        // case 38: // up
        // case 39: // right
        // case 40: // down
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

        // if menu is hidden, bookmark item should keep selected
        // if item doesn't have id, it is menu item
        if (MENU.hidden || item.hvClass('menu-item')) {
          item.rmClass('selected');
        }
      }
    },
    mouseover: function(event) {
      var item = getItem(event.target);

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

        if (!item.hvClass('grey-item')) {
          item.addClass('selected');
        }
      }
    }
  });


  // functions
  function clickSwitcher(mouse_button, url) {
    var switcher;
    if (mouse_button === 0) {
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
          _tab.update({ url: url });
        } else {
          if (BOOKMARKLET) {
            _tab.executeScript(null, { code: url });
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

  function createItem(title, url, after_fn) {
    var box_num = getParentBoxNum(TARGET_ITEM);

    _bookmark.create({
      parentId: BOX_PID[box_num],
      title: title,
      url: url,
      index: getItemIndex(TARGET_ITEM)
    }, after_fn);
  }

  function dragEndEvent(event) {
    if (DRAG_ITEM) {
      clearTimeout(DRAG_TIMEOUT);

      // remove DRAG_ITEM if it is not visible
      if (DRAG_ITEM.parentNode === PRELOAD) {
        DRAG_ITEM.remove();
      }
      // reset DRAG_ITEM to default value
      DRAG_ITEM = null;

      // move the dragged item to the location of DRAG_PLACE
      if (DRAG_PLACE.parentNode !== PRELOAD) {
        var target = event.target;
        var bkmark_index = getItemIndex(DRAG_PLACE) - 1;
        var box_num = getParentBoxNum(DRAG_PLACE);

        _bookmark.move(target.id, {
          parentId: BOX_PID[box_num],
          index: bkmark_index
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
        var box_num = getParentBoxNum(item);
        var is_place_before = event.offsetY < item.offsetHeight / 2;
        var isnt_drag_item = item.id !== DRAG_ITEM.id;

        var item_sibling = item[is_place_before ? 'prev' : 'next']();

        var isnt_drag_item_sibling = !item_sibling ||
                                     item_sibling.id !== DRAG_ITEM.id;

        if (isnt_drag_item &&
            isnt_drag_item_sibling &&
            !isRootFolder(item)) {
          DRAG_PLACE[is_place_before ? 'before' : 'after'](item);
        } else {
          DRAG_PLACE.appendTo(PRELOAD);
        }

        // item cannot be the parent folder of itself
        if (isnt_drag_item && isFolder(item)) {
          openFolder(item.id);
          return false;
        }

        resetBox(box_num);
      }, 70);
    }
  }

  function dragStartEvent(event) {
    var target = event.target;
    var box_num;

    if (isItem(target)) {
      DRAG_ITEM = target;

      box_num = getParentBoxNum(target);
      // if there is next box
      if (box_num === BOX.length) {
        genNinja(box_num).hide();
        genNinja(box_num + 1);
      }
    }
  }

  function expandWidth(expand) {
    if (IS_EXPANDED !== expand) {
      IS_EXPANDED = expand;
      modBodyWidth(getNowWidth());
    }
  }

  function focusSearchInput() {
    if (MENU_COVER.hidden) {
      SEARCH_INPUT.focus();
    }
  }

  function genBox(box_num, box_pid) {
    var box = BOX_TEMPLATE.cloneTo(CONTAINER[box_num % 2]);
    BOX[box_num] = box;

    BOX_PID[box_num] = box_pid;
    savLastPID();

    getBoxList(box_num)
      .data(DATATEXT_BOX_NUM, box_num)
      .on({
        mousewheel: function(event) {
          event.preventDefault();

          // control scrolling speed
          this.scrollTop -= ITEM_HEIGHT * event.wheelDelta / 120 >> 0;
        },
        scroll: function() {
          savLastScroll(this);
        }
      });

    return box;
  }

  function genFirstBox() {
    if (BOX[0]) {
      BOX[0].remove();
    }

    // remove headbox
    genBox(0, DEF_EXPAND + '').first().remove();

    genFirstList();
  }

  function genFirstList() {
    _bookmark.getChildren('0', function(tree) {
      tree.ascEach(function(stem) {
        var stem_id = stem.id * 1;
        if (stem_id === DEF_EXPAND ||
            HIDE_ROOT_FOLDER.hv(stem_id)) {
          return true;
        }
        genItem(0, stem).addClass('rootfolder').draggable = false;
      });

      _bookmark.getChildren(DEF_EXPAND + '', function(twig) {
        genList(0, twig);

        loadLastPos();
      });
    });
  }

  function genItem(box_num, node) {
    var new_item = ITEM.cloneTo(getBoxList(box_num));
    var icon = new_item.first();

    var title = node.title;
    var url = node.url;

    new_item.id = node.id;

    setItemText(new_item, title, url);

    if (url) {
      new_item.data(DATATEXT_BOOKMARK_TYPE, 'bkmark');

      if (url !== SEPARATE_THIS) {
        // for bookmarks
        icon.src = 'chrome://favicon/' + url;

        setTooltip(new_item, title, url);
      } else {
        // for separators
        new_item.addClass('separator');
      }
    } else {
      // for folders
      new_item.data(DATATEXT_BOOKMARK_TYPE, 'folder');
      icon.src = 'img/folder.png';
    }

    return new_item;
  }

  function genList(box_num, twig) {
    NOW_SCROLL_TOP[box_num] = 0;

    twig.ascEach(function(leaf) {
      genItem(box_num, leaf);
    });
    insertNoBkmark(box_num);

    setHeight(box_num);
  }

  function genMenu() {
    var area = MENU.new$('div');

    MENU_PATTERN.ascEach(function(menu_item_text) {
      if (menu_item_text === '|') {
        area = MENU.new$('div');
      } else {
        area.new$('p')
          .addClass('item')
          .addClass('menu-item')
          .addText(menu_item_text && _getMsg(menu_item_text));
      }
    });

    MENU.clickByButton(0, menuEvent);
  }

  function genNinja(box_num) {
    return NINJA_LIST[box_num] = BOX[box_num].new$('div').addClass('ninja');
  }

  function getBoxList(box_num) {
    return BOX[box_num].class$('folderlist')[0];
  }

  function getItem(element) {
    var item;
    var item_parent = element.parentNode;

    if (isItem(element)) {
      item = element;
    } else if (isItem(item_parent)) {
      item = item_parent;
    }

    return item;
  }

  function getItemIndex(item) {
    return item.hvClass('no-bkmark') ? 0 :
      item.index() + 1 - getRootFolderNum(getParentBoxNum(item));
  }

  function getMaxHeight() {
    return HEIGHT_LIST.max();
  }

  function getMenuItemNum(menu_item) {
    return Array.prototype.indexOf.call(MENU.class$('menu-item'), menu_item);
  }

  function getNowHeight() {
    return BODY.offsetHeight;
  }

  function getNowWidth() {
    return IS_EXPANDED ? SET_WIDTH * 2 + 2 : SET_WIDTH;
  }

  function getParentBoxNum(item) {
    if (item.id !== DEF_EXPAND + '') {
      var id_parent = item.parentNode;
      if (id_parent) {
        return id_parent.data(DATATEXT_BOX_NUM) * 1;
      }
    }
    return 0;
  }

  function getRootFolderNum(box_num) {
    return getBoxList(box_num).class$('rootfolder').length;
  }

  function greyMenuItem(grey_arr, is_grey) {
    var menu = MENU.children[2];
    grey_arr.ascEach(function(item_num) {
      menu.children[item_num].toggleClass('grey-item', is_grey);
    });
  }

  function hideMenu(is_hide_cover) {
    MENU.fadeOut();

    // reset window width and height
    // because they may be changed when displaying menu
    modBodyWidth(getNowWidth());
    modBodyHeight(getMaxHeight());


    if (is_hide_cover !== false) {
      EDITOR.fadeOut();
      MENU_COVER.fadeOut();
      TARGET_ITEM.rmClass('selected');
      SEARCH_INPUT.focus();
    }
  }

  function initBookmarkEvent() {
    var create_element_in_dom = function(id, info) {
      var box_num = BOX_PID.indexOf(info.parentId);

      // if parent box exists
      if (box_num >= 0) {
        removeNoBkmark(box_num);

        genItem(box_num, info)
          .after(getRootFolderNum(box_num) + info.index - 1);

        setHeight(box_num);
      }
    };

    var remove_element_from_dom = function(id) {
      var box_num;
      var removed_element = id$(id);

      if (COPY_CUT_ITEM.id === id) {
        COPY_CUT_ITEM.id = null;
      }

      if (removed_element) {
        box_num = getParentBoxNum(removed_element);

        // if this bookmark is folder, remove its sub tree from DOM
        if (BOX_PID.hv(id)) {
          resetBox(box_num);
        }

        removed_element.remove();
        insertNoBkmark(box_num);

        setHeight(box_num);
      }
    };

    _bookmark.onChanged.addListener(function(id, info) {
      var changed_item = id$(id);
      if (changed_item) {
        setItemText(changed_item, info.title, info.url);
      }
    });

    _bookmark.onCreated.addListener(create_element_in_dom);

    _bookmark.onMoved.addListener(function(id) {
      _bookmark.get(id, function(bkmark) {
        remove_element_from_dom(id);
        create_element_in_dom(id, bkmark[0]);
      });
    });

    _bookmark.onRemoved.addListener(remove_element_from_dom);
  }

  function initEditor() {
    var editor_button = EDITOR.tag$('button');

    // confirm editing
    editor_button[0]
      .addText(_getMsg('confirm'))
      .clickByButton(0, function() {
        var editor_input = EDITOR.tag$('input');
        var next_box;
        var title = editor_input[0].value;
        var url;

        if (EDITOR_CREATE) {
          createItem(title);
        } else {
          if (isFolder(TARGET_ITEM)) {
            next_box = BOX[getParentBoxNum(TARGET_ITEM) + 1];
            if (next_box) {
              next_box.class$('head-title')[0].innerText = title;
            }
          } else {
            url = editor_input[1].value;
            setTooltip(TARGET_ITEM, title, url);
          }

          _bookmark.update(TARGET_ITEM.id, {
            title: title,
            url: url
          });
        }

        hideMenu();
      });

    // cancel editing
    editor_button[1]
      .addText(_getMsg('cancel'))
      .clickByButton(0, hideMenu);

    // type 'Enter' on input tag
    EDITOR.on('keydown', function(event) {
      if (event.keyCode === 13) {
        editor_button[0].click();
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
    var font_size_px = FONT_SIZE + 'px';
    // -2 for border width
    var separator_height_px = (ITEM_HEIGHT / 2) - 2 + 'px';

    // if the font family's name has whitespace, use quote to embed it
    var font_family = FONT_FAMILY.split(',').map(function(x) {
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
      'font': font_size_px + ' ' + font_family
    });

    if (FONT_SIZE > 16) {
      CSS.set({
        '.bookmark-item': {
          'height': font_size_px,
          'line-height': font_size_px
        },
        '.icon': {
          'width': font_size_px
        }
      });
    }

    // set separator height depend on item height
    CSS.set('.separator', {
      'height': separator_height_px,
      'line-height': separator_height_px
    });
  }

  function insertNoBkmark(box_num) {
    var box_list = getBoxList(box_num);
    var no_bkmark = !IS_SEARCHING ? NOBKMARK : NORESULT;

    if (box_list.children.length === getRootFolderNum(box_num)) {
      no_bkmark.cloneTo(box_list);
    }
  }

  function isFolder(item) {
    return item.data(DATATEXT_BOOKMARK_TYPE) === 'folder';
  }

  function isItem(element) {
    return element.hvClass('item');
  }

  function isRootFolder(item) {
    return item.hvClass('rootfolder');
  }

  function loadLastPos() {
    if (REMEMBER_POS) {
      LAST_BOX_PID.ascEach(function(folder_id, box_num) {
        var fn_after_open = function() {
          var last_scroll_top = LAST_SCROLL_TOP[box_num];
          if (last_scroll_top) {
            getBoxList(box_num).scrollTop = last_scroll_top;
            NOW_SCROLL_TOP[box_num] = last_scroll_top;
          }
        };

        if (box_num === 0) {
          if (folder_id === DEF_EXPAND + '') {
            fn_after_open();
          }
        } else {
          openFolder(folder_id, fn_after_open);
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
    var menu_item_num = getMenuItemNum(target);
    var tar_item_id = TARGET_ITEM.id;

    switch (menu_item_num) {
      // open bookmarks in tab or win
      case 0:
      case 1:
      case 2:
        openBkmarks(tar_item_id, isFolder(TARGET_ITEM), menu_item_num);

        break;

      case 3: // Edit... & Rename...
      case 9: // Add folder...
        EDITOR_CREATE = menu_item_num === 9;
        showEditor();
        return false;

      case 4: // Delete
        removeItem(tar_item_id);

        break;

      case 5: // Cut
      case 6: // Copy
      case 7: // Paste
        if (target.hvClass('grey-item')) {
          return false;
        }

        if (menu_item_num === 7) {
          pasteItem(COPY_CUT_ITEM.id);
        } else {
          COPY_CUT_ITEM.isCut = menu_item_num === 5;
          COPY_CUT_ITEM.id = tar_item_id;
        }

        break;

      case 8: // Add current page
        _tab.query({
          currentWindow: true,
          active: true
        }, function(tab) {
          createItem(tab[0].title, tab[0].url);
        });

        break;

      case 10: // Add separator
        createItem('- '.repeat(42), SEPARATE_THIS);

        break;

      case 11: // Sort by name
        sortByName(BOX_PID[getParentBoxNum(TARGET_ITEM)]);

        break;

      default:
        return false;
    }

    hideMenu();
  }

  function modBodyHeight(new_height) {
    BODY.style.height = new_height + 'px';
  }

  function modBodyWidth(new_width) {
    BODY.style.width = new_width + 'px';
  }

  function modMenuText(is_folder) {
    var menu_item = MENU.class$('menu-item');
    var menu_item_msg_name = is_folder ?
      ['openAll', 'openAllInN', 'openAllInI', 'rename'] :
      ['openInB', 'openInN', 'openInI', 'edit'];

    menu_item_msg_name.ascEach(function(item_text, item_num) {
      menu_item[item_num].innerText = _getMsg(item_text);
    });
  }

  function openBkmarks(target_id, is_folder, menu_item_num) {
    _bookmark[is_folder ? 'getSubTree' : 'get'](target_id, function(node) {
      var url_list = [], url_list_len = 0;

      if (is_folder) {
        node[0].children.ascEach(function(bkmark) {
          if (bkmark.url) {
            url_list[url_list_len] = bkmark.url;
            ++url_list_len;
          }
        });

        if (WARN_OPEN_MANY &&
            url_list_len > 5 &&
            !confirm(_getMsg('askOpenAll', url_list_len + ''))) {
          return false;
        }
      } else {
        url_list = [node[0].url];
      }

      if (menu_item_num === 0) {
        url_list.ascEach(function(url) {
          _tab.create({
            url: url,
            active: false
          });
        });
      } else {
        _win.create({
          url: url_list,
          incognito: menu_item_num !== 1
        });
      }

      window.close();
    });
  }

  function openFolder(id, fn_after_open) {
    if (BOX_PID.hv(id)) {
      return false;
    }

    _bookmark.getChildren(id, function(twig) {
      if (twig === undefined) {
        return false;
      }

      var folder_item = id$(id);

      var box_num = getParentBoxNum(folder_item);
      var folder_cover_fn;

      var next_box_num = box_num + 1;
      var pre_box_num = box_num - 1;

      var next_box = BOX[next_box_num];

      if (next_box) {
        tempDragItem(box_num);
        next_box.remove();
      }
      next_box = genBox(next_box_num, id);
      next_box.class$('head-title')[0].innerText = folder_item.innerText;

      genList(next_box_num, twig);

      if (box_num > 0 && pre_box_num >= NINJA_LIST.length) {
        folder_cover_fn = function() {
          resetBox(pre_box_num);
        };

        genNinja(pre_box_num)
          .on('click', folder_cover_fn)
          .hoverTimeout(folder_cover_fn, 300, 20);
      }

      setTimeout(function() {
        expandWidth(true);
      }, 50);

      if (fn_after_open) {
        fn_after_open();
      }
    });
  }

  function openOptionsPage() {
    _tab.create({ url: 'options.html' });
  }

  function pasteItem(node_id) {
    if (COPY_CUT_ITEM.isCut) {
      var box_num = getParentBoxNum(TARGET_ITEM);
      _bookmark.move(node_id, {
        parentId: BOX_PID[box_num],
        index: getItemIndex(TARGET_ITEM)
      });
    } else {
      _bookmark.getSubTree(node_id, function(node) {
        var copy_child_fn = function(folder_list, folder_id) {
          folder_list.children.ascEach(function(bkmark) {
            _bookmark.create({
              parentId: folder_id,
              title: bkmark.title,
              url: bkmark.url
            }, function(new_item) {
              if (!bkmark.url) {
                copy_child_fn(bkmark, new_item.id);
              }
            });
          });
        };

        node = node[0];
        createItem(node.title, node.url, function(folder) {
          if (!node.url) {
            copy_child_fn(node, folder.id);
          }
        });
      });
    }
  }

  function removeItem(item_id) {
    var is_folder = isFolder(id$(item_id));
    _bookmark[is_folder ? 'removeTree' : 'remove'](item_id);
  }

  function removeNoBkmark(box_num) {
    var box_list = getBoxList(box_num);
    var no_bkmark_class_name = !IS_SEARCHING ? 'no-bkmark' : 'no-result';

    var no_bkmark = box_list.class$(no_bkmark_class_name)[0];

    if (no_bkmark) {
      no_bkmark.remove();
    }
  }

  function resetBox(level) {
    if (!IS_SEARCHING && level === BOX.length - 1) { // if no next list
      return false;
    }

    tempDragItem(level);

    if (level === 0) {
      expandWidth(false);
    }

    NINJA_LIST.descEach(function() {
      NINJA_LIST.pop().fadeOut(true);
    }, level - 1);

    BOX.descEach(function() {
      BOX.pop().fadeOut(true);
      BOX_PID.pop();
      NOW_SCROLL_TOP.pop();
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

  function savLastScroll(box_list) {
    if (REMEMBER_POS) {
      var save_fn = function() {
        jsonStorage('set', NAME_LAST_SCROLL_TOP, NOW_SCROLL_TOP);
      };
      if (box_list) {
        initTimeout(NAME_LAST_SCROLL_TOP, function() {
          var box_num = box_list.data(DATATEXT_BOX_NUM) * 1;
          NOW_SCROLL_TOP[box_num] = box_list.scrollTop;
          save_fn();
        }, 200);
      } else {
        save_fn();
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
      var box_list = getBoxList(0);
      var sorted_result = sortByTitle(searchResultSelector(results));

      removeNoBkmark(0);

      update$(box_list, sorted_result, function(item) {
        genItem(0, item).draggable = false;
      });
      insertNoBkmark(0);

      // scroll back to the top
      box_list.scrollTop = 0;

      setHeight(0);
    });
  }

  function searchResultSelector(results) {
    var is_only_search_title = SEARCH_TARGET === 1;
    var new_results = [];
    var splitted_key_arr = [];

    if (is_only_search_title) {
      SEARCH_INPUT.value.split(' ').ascEach(function(splitted_key) {
        if (splitted_key !== '') {
          splitted_key_arr.push(splitted_key.toLowerCase());
        }
      });
    }

    results.ascEach(function(bkmark) {
      var bkmark_title;
      var bkmark_url = bkmark.url;
      var is_not_title_matched;

      if (bkmark_url && bkmark_url !== SEPARATE_THIS) {
        if (is_only_search_title) {
          bkmark_title = bkmark.title.toLowerCase();
          splitted_key_arr.ascEach(function(splitted_key) {
            if (!bkmark_title.hv(splitted_key)) {
              is_not_title_matched = true;
              return false;
            }
          });

          if (is_not_title_matched) {
            return true;
          }
        }

        new_results.push(bkmark);
        if (new_results.length === MAX_RESULTS) {
          return false;
        }
      }
    });

    return new_results;
  }

  function searchSwitch(is_start_search) {
    IS_SEARCHING = is_start_search;

    if (is_start_search) {
      if (REMEMBER_POS) {
        LAST_BOX_PID = BOX_PID.slice();
        LAST_SCROLL_TOP = NOW_SCROLL_TOP.slice();
      }
      resetBox(0);
    } else {
      genFirstBox();
    }
  }

  function setBottomRight(settler, set_bottom, set_right) {
    settler.css({
      bottom: [set_bottom, 0].max() + 'px',
      right: [set_right, 0].max() + 'px'
    });
  }

  function setEditorPos() {
    EDITOR.show();
    setBottomRight(
      EDITOR,
      getNowHeight() - EDITOR.offsetHeight - TARGET_ITEM.offset().top,
      getParentBoxNum(TARGET_ITEM) % 2 ? SET_WIDTH + 2 : 0
    );
  }

  function setEditorText(title, url) {
    var editor_title = _getMsg(url ? 'edit' : 'rename').replace('...', '');
    var input_field = EDITOR.tag$('input');

    id$('edit-title').innerText = editor_title;
    input_field[0].val(title).selectText().focus();
    input_field[1].val(url).hidden = !url;
  }

  function setHeight(box_num) {
    var box_list = getBoxList(box_num);
    var list_last_item = box_list.last();

    var body_height;
    var footer_height = 4;
    var header_height = box_num > 0 ? 32 : 0;
    var list_height;
    var search_height = box_num % 2 ? 0 : 24;

    var max_list_height = MAX_HEIGHT - search_height - header_height;

    list_height = list_last_item.offsetTop +
                  list_last_item.offsetHeight -
                  header_height;
    if (list_height > max_list_height) {
      list_height = max_list_height;
      box_list.style.maxHeight = list_height + 'px';
    }

    body_height = list_height + search_height + header_height + footer_height;
    HEIGHT_LIST[box_num] = [MAX_HEIGHT, body_height].min();
    modBodyHeight(getMaxHeight());
  }

  function setItemText(item, title, url) {
    item.last().innerText = title || url || '';
  }

  function setMenuPos(mouse_x, mouse_y) {
    var menu_height = MENU.offsetHeight;
    var menu_width = MENU.offsetWidth;
    var now_height = getNowHeight();

    if (menu_height > now_height) {
      modBodyHeight(menu_height);
    }

    if (menu_width > BODY.offsetWidth) {
      modBodyWidth(menu_width);
    }

    setBottomRight(
      MENU,
      now_height - menu_height - mouse_y,
      getNowWidth() - menu_width - mouse_x
    );
  }

  function setTooltip(item, title, url) {
    var tooltip_arr = [];

    if (TOOLTIP) {
      tooltip_arr = [title, url];
    }

    if (IS_SEARCHING) {
      var breadcrumb_arr = [];
      var getBreadcrumb = function(bread_id) {
        _bookmark.get(bread_id, function(node) {
          if (node === undefined) {
            return false;
          }

          node = node[0];

          if (![item.id, '0'].hv(node.id)) {
            breadcrumb_arr.unshift(node.title);
          }

          if (node.parentId !== undefined) {
            getBreadcrumb(node.parentId);
          } else {
            tooltip_arr.unshift(breadcrumb_arr.join(' > '));
            item.title = tooltip_arr.join('\n');
          }
        });
      };

      getBreadcrumb(item.id);
    } else if (tooltip_arr.length > 0) {
      item.title = tooltip_arr.join('\n');
    }
  }

  function showEditor() {
    hideMenu(false);

    if (EDITOR_CREATE) {
      setEditorPos();
      setEditorText(_getMsg('newFolder'));
    } else {
      _bookmark.get(TARGET_ITEM.id, function(bkmark) {
        setEditorPos();
        setEditorText(bkmark[0].title, bkmark[0].url);
      });
    }
  }

  function sortByName(parent_id) {
    _bookmark.getChildren(parent_id, function(child_list) {
      var gen_bkmark_list = function() {
        var new_bkmark_list = [
          [/* Separators */],
          [/* Folders */],
          [/* Bookmarks */]
        ];
        separated_child_list.push(new_bkmark_list);
        return new_bkmark_list;
      };

      var new_child_list = [];
      var separated_child_list = [];
      var selected_child_list = gen_bkmark_list();

      /**
       * Split all bookmarks into n main group,
       * where n = the number of separators + 1
       * Each main group contains 3 small groups
       * (Separators, Folders, Bookmarks)
       */
      child_list.ascEach(function(bkmark) {
        var selected_bkmark_list_num;
        var url = bkmark.url;

        if (url) {
          if (url !== SEPARATE_THIS) {
            // Bookmarks
            selected_bkmark_list_num = 2;
          } else {
            //  Separators
            selected_bkmark_list_num = 0;
            selected_child_list = gen_bkmark_list();
          }
        } else {
          // Folders
          selected_bkmark_list_num = 1;
        }

        selected_child_list[selected_bkmark_list_num].push(bkmark);
      });

      // Concatenate all lists into single list
      separated_child_list.ascEach(function(selected_child_list) {
        selected_child_list.ascEach(function(bkmark_list) {
          new_child_list = new_child_list.concat(sortByTitle(bkmark_list));
        });
      });

      // Sort bookmarks by Selection sort
      new_child_list.ascEach(function(bkmark, index) {
        var old_index = child_list.indexOf(bkmark);

        if (old_index !== index) {
          child_list.move(old_index, index);

          _bookmark.move(bkmark.id, {
            index: index + (index > old_index ? 1 : 0)
          });
        }
      });
    });
  }

  function sortByTitle(bkmark_list) {
    return bkmark_list.sort(function(bkmark1, bkmark2) {
      return bkmark1.title.localeCompare(bkmark2.title);
    });
  }

  // prevent dragend from stop working
  function tempDragItem(level) {
    if (DRAG_ITEM !== null && getParentBoxNum(DRAG_ITEM) > level) {
      DRAG_ITEM.appendTo(PRELOAD);
    }
  }
});
