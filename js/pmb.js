'use strict';
chrome.storage.sync.get(null, function(STORAGE) {
  // shorter global
  var _bookmark = chrome.bookmarks;
  var _getMsg = chrome.i18n.getMessage;
  var _localStorage = localStorage;
  var _tab = chrome.tabs;
  var _win = chrome.windows;

  // storage (e.g. options)
  var BOOKMARKLET = STORAGE.bookmarklet;
  var DEF_EXPAND = STORAGE.defExpand;
  var FONT_SIZE = STORAGE.fontSize;
  var FONT_FAMILY = STORAGE.fontFamily;
  var HIDE_MOBILE = STORAGE.hideMobile;
  var MAX_RESULTS = STORAGE.maxResults;
  var OP_FOLDER_BY = STORAGE.opFolderBy;
  var LAST_PID = (_localStorage.getItem('lastPID') || '').split(',');
  var LAST_SCROLL = (_localStorage.getItem('lastScroll') || '').split(',');
  var REMEMBER_POS = STORAGE.rememberPos;
  var SEARCH_TARGET = STORAGE.searchTarget;
  var SET_WIDTH = STORAGE.setWidth;
  var TOOLTIP = STORAGE.tooltip;
  var WARN_OPEN_MANY = STORAGE.warnOpenMany;

  // pre-defined
  var BOX = [];
  var BOX_PID = [DEF_EXPAND + '']; //store the parentId of each box
  var COPY_CUT_ITEM = {
    id: null,
    isCut: false
  };
  var DRAG_ITEM = null;
  var EDITOR_CREATE;
  var HEIGHT_LIST = [];
  var HOVER_TIMEOUT;
  var IS_EXPANDED = false;
  var IS_SEARCHING = false;
  var ITEM_HEIGHT = (FONT_SIZE > 16 ? FONT_SIZE : 16) + 6;
  var MAX_HEIGHT = 596;
  var MENU_PATTERN = ['', '', '', '|', '', 'del', '|', 'cut', 'copy', 'paste', '|', 'addPage', 'addFolder', 'addSeparator', '|', 'sortByName'];
  var NINJA_LIST = [];
  var NOW_SCROLL_TOP = [];
  var ON_MOD_KEY;
  var SEPARATE_THIS = 'http://separatethis.com/';
  var TARGET_ITEM;

  // attr: data's text
  var DATATEXT_BOX_NUM = 'box_num';

  // id
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
  var ITEM = PRELOAD.class$('bkmark')[0];
  var NOBKMARK = new$('p').addClass('no-bkmark').addText(_getMsg('noBkmark'));
  var NORESULT = new$('div').addClass('no-result').addText(_getMsg('noResult'));


  // if first run
  if (FONT_FAMILY === undefined) {
    openOptions();
  }

  // render
  initStyleOptions();
  genFirstBox();

  // initiate search
  initSearch();

  // initiate menu
  genMenu();
  MENU_COVER.on('click', hideMenu);

  // initiate editor
  initEditor();

  // event delegation
  BODY.on({
    click:
      function(event) {
        var mouse_button = event.button;
        var _target = getPTag(event.target);
        var _id = _target.id;

        switch (_target.classList[0]) {
          case 'head-close':
            resetBox(_target.parentNode.next().data(DATATEXT_BOX_NUM) - 1);
            break;
          case 'folder':
            if (mouse_button === 1) {
              openBkmarks(_id, true, 0);
            } else if (mouse_button === 0 && OP_FOLDER_BY) {
              openFolder(_id);
            }
            break;
          case 'bkmark':
            _bookmark.get(_id, function(bkmark) {
              clickSwitcher(mouse_button, bkmark[0].url);
            });
        }

        focusSearchInput();
      },
    contextmenu: // Customize right click menu
      function(event) {
        var _target = getPTag(event.target);
        var _class = _target.classList[0];
        var hide_param;

        if (_target.tagName === 'INPUT') {
          return false;
        }

        event.preventDefault();
        clearTimeout(HOVER_TIMEOUT); // clear the action of opening folder

        switch (_class) {
          case 'folder':
            if (isRootFolder(_target)) {
              hide_param = [false, true, true, true, true];
              break;
            }
          case 'bkmark':
            if (!IS_SEARCHING) {
              hide_param = [false, false, false, false, false];
            } else {
              hide_param = [false, false, false, true, true];
            }
            break;
          case 'no-bkmark':
            hide_param = [true, true, false, false, true];
            break;
          default:
            focusSearchInput();
            return false;
        }
        MENU.hide(hide_param);

        TARGET_ITEM = _target;
        modMenuText(isFolder(_target));

        greyMenuItem([0, 1], _class === 'no-bkmark');
        greyMenuItem([2], COPY_CUT_ITEM.id === null);

        MENU_COVER.show();
        MENU.show();
        SEARCH_INPUT.blur();

        setMenuPos(event);
      },
    dragend: dragEndEvent,
    dragover: dragOverEvent,
    dragstart: dragStartEvent,
    keydown:
      function(event) {
        var key_code = event.keyCode;
        switch (key_code) {
          case 13:
            // if (isHovering()) {
            // } else if (IS_SEARCHING) {
            if (IS_SEARCHING) {
              getBoxList(0).firstChild.click(); // enter the first bkmark when press return key
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
          //   break;
        }
      },
    keyup:
      function(event) {
        if (event.keyCode === ON_MOD_KEY) {
          ON_MOD_KEY = null;
        }
      },
    mousedown: // disable the scrolling arrows after middle click
      function(event) {
        if (event.button === 1) {
          event.preventDefault();
        }
      },
    mouseout:
      function(event) {
        var _target = getPTag(event.target);

        if (_target.tagName === 'P' && MENU_COVER.hidden) {
          switch (_target.classList[0]) {
            case 'folder':
            case 'bkmark':
            case 'no-bkmark':
              clearTimeout(HOVER_TIMEOUT);
          }
          _target.rmClass('selected');
        }
      },
    mouseover:
      function(event) {
        var _target = getPTag(event.target);

        if (_target.tagName === 'P' && MENU_COVER.hidden) {
          if (!OP_FOLDER_BY) {
            switch (_target.classList[0]) {
              case 'folder':
                HOVER_TIMEOUT = setTimeout(function() {
                  openFolder(_target.id);
                }, 250);
                break;
              case 'bkmark':
              case 'no-bkmark':
                HOVER_TIMEOUT = setTimeout(function() {
                  resetBox(getBoxNum(_target));
                }, 250);
            }
          }
          _target.addClass('selected');
        }
      },
    mousewheel: // control scrolling speed
      function(event) {
        event.preventDefault();

        for (var target = event.target;
             target !== BODY;
             target = target.parentNode) {
          if (target.hvClass('folderlist')) {
            target.scrollTop -= ITEM_HEIGHT * event.wheelDelta / 120 >> 0;
            savLastScroll(target);
            break;
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
            openOptions();
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
      setTimeout(close, 200);
    }
  }

  function createItem(title, url, fn) {
    var box_num = getBoxNum(TARGET_ITEM);

    _bookmark.create({
      parentId: BOX_PID[box_num],
      title: title,
      url: url,
      index: getItemIndex(TARGET_ITEM)
    }, function(new_obj) {
      genItem(box_num, new_obj).after(TARGET_ITEM);

      if (TARGET_ITEM.hvClass('no-bkmark')) {
        TARGET_ITEM.rm(); // delete no-bkmark's element
      }

      setHeight(box_num);

      if (!url && fn) {
        fn(new_obj.id);
      }

      // scrollAnim(list_addr);
    });
  }

  function dragEndEvent(event) {
    if (DRAG_PLACE.parentNode != PRELOAD) {
      var _this = event.target;
      var box_num = getBoxNum(DRAG_PLACE);
      var no_bkmark = BOX[box_num].class$('no-bkmark')[0];

      if (no_bkmark) {
        no_bkmark.rm();
      }

      _bookmark.move(_this.id, {
        parentId: BOX_PID[box_num],
        index: getItemIndex(DRAG_PLACE) - 1
      });

      _this.before(DRAG_PLACE);
      DRAG_PLACE.appendTo(PRELOAD);
    }

    focusSearchInput();

    if (DRAG_ITEM.parentNode == PRELOAD) {
      DRAG_ITEM.rm();
    }
    DRAG_ITEM = null;
  }

  function dragOverEvent(event) {
    var _this = event.target;

    if (_this.tagName == 'P' && DRAG_ITEM !== null) {
      initTimeout('drag', function() {
        var _this_id = _this.id;
        var box_num = getBoxNum(_this);
        var is_place_before = event.offsetY < _this.offsetHeight / 2;

        if (_this != DRAG_ITEM
            && _this[is_place_before ? 'prev' : 'next']() != DRAG_ITEM
            && !isRootFolder(_this)) {
          DRAG_PLACE[is_place_before ? 'before' : 'after'](_this);
        } else {
          DRAG_PLACE.appendTo(PRELOAD);
        }

        if (_this != DRAG_ITEM && isFolder(_this)) {
          openFolder(_this_id);
          return false;
        }

        resetBox(box_num);
      }, 70);
    }
  }

  function dragStartEvent(event) {
    var _target = event.target;
    var box_num = getBoxNum(_target);

    if (_target.tagName !== 'P') {
      return false;
    }

    DRAG_ITEM = _target;

    if (box_num === BOX.length) { // if there is next box
      genNinja(box_num).hide();
      genNinja(box_num + 1);
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

  function genBox(box_num) {
    var box = BOX[box_num] = BOX_TEMPLATE.cloneTo(CONTAINER[box_num % 2]);
    getBoxList(box_num).data(DATATEXT_BOX_NUM, box_num);
    return box;
  }

  function genFirstBox() {
    if (BOX[0]) {
      BOX[0].rm();
    }

    // remove headbox
    genBox(0).first().rm();

    genFirstList();
  }

  function genFirstList() {
    _bookmark.getChildren('0', function(tree) {
      tree.ascEach(function(stem) {
        if (stem.id == DEF_EXPAND ||
            stem.id == 2 && HIDE_MOBILE) {
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
      new_item.className = 'folder';
      icon.src = 'img/folder.png';
    }

    return new_item;
  }

  function genList(box_num, twig) {
    twig.ascEach(function(leaf) {
      genItem(box_num, leaf);
    });
    noBkmarkHandler(box_num);

    setHeight(box_num);
  }

  function genMenu() {
    var area = MENU.new$('div');

    MENU_PATTERN.ascEach(function(menu_item_text) {
      if (menu_item_text === '|') {
        area = MENU.new$('div');
      } else {
        area.new$('p').innerText = menu_item_text && _getMsg(menu_item_text);
      }
    });

    MENU.on('click', menuEvent);
  }

  function genNinja(box_num) {
    return NINJA_LIST[box_num] = BOX[box_num].new$('div').addClass('ninja');
  }

  function getBoxList(box_num) {
    return BOX[box_num].class$('folderlist')[0];
  }

  function getBoxNum(id) {
    if (id != DEF_EXPAND) {
      var id_parent = (isObj(id) ? id : id$(id)).parentNode;
      if (id_parent) {
        return id_parent.data(DATATEXT_BOX_NUM) * 1;
      }
    }
    return 0;
  }

  function getItemIndex(item) {
    // item.index() + 1 because when two items with same index, the new one will -1
    return item.hvClass('no-bkmark') ? 0 : item.index() + 1 - getRootFolderNum(getBoxNum(item));
  }

  function getMaxHeight() {
    return HEIGHT_LIST.max();
  }

  function getMenuItemNum(menu_item) {
    return Array.prototype.indexOf.call(MENU.tag$('p'), menu_item);
  }

  function getNowHeight() {
    return BODY.offsetHeight;
  }

  function getNowWidth() {
    return IS_EXPANDED ? SET_WIDTH * 2 + 2 : SET_WIDTH;
  }

  function getPTag(item) {
    return ['SPAN', 'IMG'].hv(item.tagName) ? item.parentNode : item;
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
    opacityAnim(MENU, 0);
    //// to reset width and height because they may be changed when the width and height are not enough for displaying menu
    modBodyWidth(getNowWidth());
    modBodyHeight(getMaxHeight());
    ////

    if (is_hide_cover !== false) {
      opacityAnim(EDITOR, 0);
      opacityAnim(MENU_COVER, 0);
      TARGET_ITEM.rmClass('selected');
      SEARCH_INPUT.focus();
    }
  }

  function initEditor() {
    var editor_button = EDITOR.tag$('button');

    // confirm editing
    editor_button[0]
      .addText(_getMsg('confirm'))
      .on('click', function() {
        var editor_input = EDITOR.tag$('input');
        var next_box;
        var title = editor_input[0].value;
        var url;

        if (EDITOR_CREATE) {
          createItem(title);
        } else {
          if (isFolder(TARGET_ITEM)) {
            next_box = BOX[getBoxNum(TARGET_ITEM) + 1];
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
          setItemText(TARGET_ITEM, title, url);
        }

        hideMenu();
      });

    // cancel editing
    editor_button[1]
      .addText(_getMsg('cancel'))
      .on('click', hideMenu);

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
    var separator_height_px = (FONT_SIZE > 16 ? FONT_SIZE : 18) / 2 + 'px';

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
    Css.set('.panel-width', {
      'width': SET_WIDTH + 'px'
    });


    // set font style
    Css.set('body', {
      'font': font_size_px + ' ' + font_family
    });

    if (FONT_SIZE > 16) {
      Css.set({
        '.folderlist > p': {
          'height': font_size_px,
          'line-height': font_size_px
        },
        '.icon': {
          'width': font_size_px
        }
      });
    }

    Css.set('.folderlist > .separator', {
      'height': separator_height_px,
      'line-height': separator_height_px
    });
  }

  function isFolder(item) {
    return item.hvClass('folder');
  }

  function isHovering() {
    return class$('selected').length > 0;
  }

  function isRootFolder(item) {
    return item.hvClass('rootfolder');
  }

  function loadLastPos() {
    if (REMEMBER_POS && LAST_PID.length > 0) {
      LAST_PID.ascEach(function(folder_id, box_num) {
        var fn_after_open = function() {
          if (LAST_SCROLL[box_num]) {
            getBoxList(box_num).scrollTop = NOW_SCROLL_TOP[box_num] = LAST_SCROLL[box_num] * 1;
          }
        };

        if (box_num === 0) {
          if (DEF_EXPAND != folder_id) {
            return false;
          }
          fn_after_open();
        } else {
          openFolder(folder_id, fn_after_open);
        }
      });
    }
  }

  function menuEvent(event) {
    var _target = event.target;
    var menu_item_num = getMenuItemNum(_target);
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
        if (_target.hvClass('grey-item')) {
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
        sortByName(BOX_PID[getBoxNum(tar_item_id)]);
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
    var p_tag = MENU.tag$('p');
    var menu_item_msg_name = is_folder ?
      ['openAll', 'openAllInN', 'openAllInI', 'rename'] :
      ['openInB', 'openInN', 'openInI', 'edit'];

    menu_item_msg_name.ascEach(function(item_text, item_num) {
      p_tag[item_num].innerText = _getMsg(item_text);
    });
  }

  function noBkmarkHandler(box_num) {
    var list_addr = getBoxList(box_num);
    if (list_addr.children.length === getRootFolderNum(box_num)) {
      if (!IS_SEARCHING) {
        NOBKMARK.cloneTo(list_addr);
      } else {
        NORESULT.cloneTo(list_addr).id = 'no-result'; // id for update$()
      }
    }
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

        if (WARN_OPEN_MANY && url_list_len > 5 && !confirm(_getMsg('askOpenAll', url_list_len + ''))) {
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

      var box_num = getBoxNum(id);
      var next_box_num = box_num + 1;
      var pre_box_num = box_num - 1;
      var next_box = BOX[next_box_num];
      var folder_cover_fn;

      NOW_SCROLL_TOP[next_box_num] = 0;
      BOX_PID[next_box_num] = id;
      savLastPID();

      if (next_box) {
        tempDragItem(box_num);
        next_box.rm();
      }
      next_box = genBox(next_box_num);
      next_box.class$('head-title')[0].innerText = id$(id).innerText;

      genList(next_box_num, twig);

      if (box_num > 0 && pre_box_num >= NINJA_LIST.length) {
        folder_cover_fn = function() {
          resetBox(pre_box_num);
        };

        genNinja(pre_box_num)
          .on('click', folder_cover_fn)
          .hoverTimeout(folder_cover_fn, 300, 10);
      }

      setTimeout(function() {
        expandWidth(true);
      }, 50);

      if (fn_after_open) {
        fn_after_open();
      }
    });
  }

  function openOptions() {
    _tab.create({ url: 'options.html' });
  }

  function pasteItem(node_id) {
    if (COPY_CUT_ITEM.isCut) {
      var box_num = getBoxNum(TARGET_ITEM);
      _bookmark.move(node_id, {
        parentId: BOX_PID[box_num],
        index: getItemIndex(TARGET_ITEM)
      }, function(moved_item) {
        var paste_item = id$(moved_item.id) || genItem(box_num, moved_item);
        paste_item.after(TARGET_ITEM);
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
        createItem(node.title, node.url, function(folder_id) {
          if (!node.url) {
            copy_child_fn(node, folder_id);
          }
        });
      });
    }
  }

  function removeItem(item_id) {
    _bookmark.get(item_id, function(node) {
      var box_num;
      var is_folder = !node[0].url;
      var item = id$(item_id);

      _bookmark[is_folder ? 'removeTree' : 'remove'](item_id);

      if (item_id === COPY_CUT_ITEM.id) {
        COPY_CUT_ITEM.id = null;
      }

      if (item) {
        box_num = getBoxNum(item);

        if (is_folder) {
          resetBox(box_num);
        }

        item.rm();
        noBkmarkHandler(box_num);

        setHeight(box_num);
      }
    });
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
      opacityAnim(NINJA_LIST.pop(), -1);
    }, level - 1);

    BOX.descEach(function() {
      opacityAnim(BOX.pop(), -1);
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
      _localStorage.setItem('lastPID', BOX_PID.join());
    }
  }

  function savLastScroll(target) {
    if (REMEMBER_POS) {
      var last_scroll = 'lastScroll';
      var save_fn = function() {
        _localStorage.setItem(last_scroll, NOW_SCROLL_TOP.join());
      };
      if (target) {
        initTimeout(last_scroll, function() {
          NOW_SCROLL_TOP[target.data(DATATEXT_BOX_NUM) * 1] = target.scrollTop;
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
      update$(getBoxList(0), sortByTitle(searchResultSelector(results)), function(item) {
        genItem(0, item).draggable = false;
      });
      noBkmarkHandler(0);

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
        LAST_PID = BOX_PID.slice();
        LAST_SCROLL = NOW_SCROLL_TOP.slice();
      }
      resetBox(0);
    } else {
      genFirstBox();
    }
  }

  function setBottomRight(settler, set_bottom, set_right) {
    settler.css({
      bottom: (set_bottom > 0 ? set_bottom : 0) + 'px',
      right: (set_right > 0 ? set_right : 0) + 'px'
    });
  }

  function setEditorPos() {
    EDITOR.show();
    setBottomRight(
      EDITOR,
      getNowHeight() - EDITOR.offsetHeight - getRealTop(TARGET_ITEM),
      getBoxNum(TARGET_ITEM) % 2 ? SET_WIDTH + 2 : 0
    );
  }

  function setEditorText(title, url) {
    var input_field = EDITOR.tag$('input');

    id$('edit-title').innerText = _getMsg(url ? 'edit' : 'rename').replace('...', '');
    input_field[0].val(title).selectText().focus();
    input_field[1].val(url).hidden = !url;
  }

  function setHeight(box_num) {
    var list_addr = getBoxList(box_num);
    var list_last_item;

    var body_height;
    var footer_height = 4;
    var header_height = box_num > 0 ? 32 : 0;
    var list_height;
    var search_height = box_num % 2 ? 0 : 24;

    var max_list_height = MAX_HEIGHT - search_height - header_height;

    list_last_item = list_addr.lastChild;
    list_height = list_last_item.offsetTop + list_last_item.offsetHeight - header_height;
    if (list_height > max_list_height) {
      list_height = max_list_height;
      list_addr.style.maxHeight = list_height + 'px';
    }

    body_height = list_height + search_height + header_height + footer_height;
    HEIGHT_LIST[box_num] = body_height > MAX_HEIGHT ? MAX_HEIGHT : body_height;
    modBodyHeight(getMaxHeight());
  }

  function setItemText(item, title, url) {
    item.last().innerText = title || url || '';
  }

  function setMenuPos(event) {
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
      now_height - menu_height - event.y,
      getNowWidth() - menu_width - event.x
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

          if (node.id !== item.id && node.id != 0) {
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
        return separated_child_list[separated_child_list.length] = [[/* Separators */], [/* Folders */], [/* Bookmarks */]];
      };

      var new_child_list = [];
      var now_box_list = getBoxList(getBoxNum(TARGET_ITEM));
      var separated_child_list = [];
      var selected_child_list = gen_bkmark_list();

      /**
       * split all bookmarks into n main group, where n = the number of separators + 1
       * Each main group contains 3 small groups (Separators, Folders, Bookmarks)
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

      // prevent the rootfolder to be removed in the BOX[0]
      now_box_list.class$('rootfolder').descEach(function(element) {
        new_child_list.unshift({ id: element.id });
      });

      update$(now_box_list, new_child_list);
    });
  }

  function sortByTitle(bkmark_list) {
    return bkmark_list.sort(function(bkmark1, bkmark2) {
      return bkmark1.title.localeCompare(bkmark2.title);
    });
  }

  function tempDragItem(level) {
    if (DRAG_ITEM !== null && getBoxNum(DRAG_ITEM) > level) { // test
      DRAG_ITEM.appendTo(PRELOAD);
    }
  }
});
