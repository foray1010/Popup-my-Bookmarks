'use strict';
chrome.storage.sync.get(null, function(STORAGE) {
	//shorter global
	var _bookmark = chrome.bookmarks;
	var _getMsg = chrome.i18n.getMessage;
	var _tab = chrome.tabs;
	var _win = chrome.windows;

	//options
	var DEF_EXPAND = STORAGE.defExpand;
	var FONT_SIZE = STORAGE.fontSize;
	var OP_FOLDER_BY = STORAGE.opFolderBy;
	var SET_WIDTH = STORAGE.setWidth;

	//pre-defined
	var BOX = [];
	var BOX_PID = [DEF_EXPAND + '']; //store the parentId of each box
	var COPY_CUT_ITEM = {
			id: null,
			isCut: false
		};
	var DRAG_ITEM = null;
	var DRAG_TIMEOUT;
	var HEIGHT_LIST = [];
	var HOVER_TIMEOUT;
	var IS_EXPANDED = false;
	var ITEM_HEIGHT = (FONT_SIZE > 16 ? FONT_SIZE : 16) + 6;
	var MENU = [];
	var MENU_NUM;
	var MAX_HEIGHT = 596;
	var NINJA_LIST = [];
	var ON_MOD_KEY;
	var SEARCH_TIMEOUT;
	var SEARCHING;
	var SEPARATE_THIS = 'http://separatethis.com/';
	var TREE_LEN;
	var TARGET_ITEM;

	//id
	var BODY = document.body;
	var BODY_STYLE = BODY.style;
	var CONTAINER = [$id('main'), $id('folder')];
	var DRAG_PLACE = $id('drag-place');
	var EDITOR = $id('editor');
	var MENU_COVER = $id('menu-cover');
	var PRELOAD = $id('preload');
	var SEARCH_INPUT = $id('search-input');

	//preload
	var BOX_TEMPLATE = $id('box-template');
	var ITEM = PRELOAD.$new('p').prop({ draggable: true });
	var NINJA = PRELOAD.$new('div').prop({ className: 'ninja' });
	var NOBKMARK = PRELOAD.$new('p').prop({
			className: 'no-bkmark',
			innerText: _getMsg('noBkmark')
		});
	var NORESULT = PRELOAD.$new('div').prop({
			className: 'no-result',
			innerText: _getMsg('noResult')
		});
	var THE_END = PRELOAD.$new('hr').prop({ className: 'the-end' });

	//set the elements above
	BOX_TEMPLATE.id = null;
	ITEM.$new('img').prop({
		src: 'img/folder.png',
		alt: '',
		className: 'icon',
		draggable: false
	});
	ITEM.$new('span');

	//if first run
	if (FONT_SIZE === void 0) {
		_tab.create({ url: 'options.html' });
	}

	//pre-setting
	EDITOR.style.width = CONTAINER[1].style.width = CONTAINER[0].style.width = BODY_STYLE.width = SET_WIDTH + 'px';
	genFirstList();

	/* Search Function */
	SEARCH_INPUT.on('input', function() {
		//trigger the searchHandler function when no more input within 200ms
		clearTimeout(SEARCH_TIMEOUT);
		SEARCH_TIMEOUT = setTimeout(searchHandler, 200);
	}).placeholder = _getMsg('search');

	/* Temp Function */
	(function() {
		var editor_input = $tag('input', EDITOR);
		var editor_button = $tag('button', EDITOR);
		var font_size_px = FONT_SIZE + 'px';
	
		/* Set CSS */
		setCSS('body', { fontSize: font_size_px });
		if (FONT_SIZE > 16) {
			setCSS('.folderlist p', {
				height: font_size_px,
				lineHeight: font_size_px
			});
			setCSS('.icon', {
				height: font_size_px,
				width: font_size_px
			});
		}

		/* Editor */
		//confirm editing
		editor_button[0]
			.addText( _getMsg('confirm') )
			.clickByButton(0, function() {
				var next_box;
				var title = editor_input[0].value;
				var url;

				if ( TARGET_ITEM.hvClass('folder') ) {
					if (next_box = BOX[getBoxNum(TARGET_ITEM) + 1]) {
						next_box.children[0].innerText = title;
					}
				} else {
					url = editor_input[1].value;
					setTooltip(TARGET_ITEM, title, url);
				}

				_bookmark.update(TARGET_ITEM.id, {
					title: title,
					url: url
				});
				TARGET_ITEM.lastChild.innerText = title || url || '';
				hideMenu();
			});

		//cancel editing
		editor_button[1].addText( _getMsg('cancel') ).clickByButton(0, hideMenu);

		//type 'Enter' on input tag
		EDITOR.on('keydown', function(event) {
			if (event.keyCode === 13) {
				editor_button[0].click();
			}
		});
	}());

	/* Menu */
	//genernate menu
	genMenu(0, ['openAll', 'openAllInN', 'openAllInI', '', 'rename']);
	genMenu(1, ['openInB', 'openInN', 'openInI', '', 'edit']);

	BODY.on({
		click:
			function(event) {
				var mouse_button = event.button;
				var _target = getPTag(event.target);
				var _id = _target.id;

				switch (_target.classList[0]) {
				default:
					selectSearch(event); //autofocus to search field for better user experience
					return false;
				case 'result':
				case 'bkmark':
					_bookmark.get(_id, function(bkmark) {
						clickSwitcher(mouse_button, bkmark[0].url);
					});
					break;
				case 'folder':
					if (mouse_button === 1) {
						openBkmarks(_id, 0, 0);
					} else if (mouse_button === 0 && OP_FOLDER_BY) {
						openFolder(_id);
					}
				}
			},
		contextmenu: //Customize right click menu
			function(event) {
				event.preventDefault(); // add '//' for inspect popup, remove '//' before release

				var _target = getPTag(event.target);
				var _class = _target.classList[0];
				var menu_num = _class === 'folder' ? 0 : 1;
				var menu = MENU[menu_num];
				var menu_ccp_area = menu.children[2];
				var menu_height;
				var menu_width;
				var now_height;

				switch (_class) {
				default:
					selectSearch(event);
					return false;
				case 'result':
					menu.hide([false, false, false, true]);
					break;
				case 'folder':
					if (_target.id <= TREE_LEN) {
						menu.hide([false, true, true, true]);
						break;
					}
				case 'bkmark':
					menu.hide([false, false, false, false]);
					break;
				case 'no-bkmark':
					menu.hide([true, true, false, false]);
				}
				MENU_NUM = menu_num;
				
				greyMenuItem(menu_ccp_area, [1, 2], _class === 'no-bkmark');
				greyMenuItem(menu_ccp_area, [3], COPY_CUT_ITEM.id === null);
				
				menu.hide(false);
				MENU_COVER.hide(false);
				
				menu_height = menu.offsetHeight;
				menu_width = menu.offsetWidth;
				now_height = getNowHeight();
				
				if (menu_height > now_height) {
					modBodyH(menu_height);
				}
				
				if (menu_width > BODY.offsetWidth) {
					BODY_STYLE.width = menu_width + 'px';
				}
				
				setBottomRight(
					menu,
					now_height - menu_height - event.y,
					getNowWidth() - menu_width - event.x
				);
				
				(TARGET_ITEM = _target).addClass('selected');
			},
		dragstart: dragStartEvent,
		dragend: dragEndEvent,
		dragenter: dragEnterEvent,
		keydown:
			function(event) {
				var key_code = event.keyCode;
				switch (key_code) {
				case 13:
					if (SEARCHING) {
						getBoxList(0).firstChild.click(); //enter the first bkmark when press return key
					}
					break;
				case 16: //shift
				case 17: //ctrl
					if (key_code !== ON_MOD_KEY) {
						ON_MOD_KEY = key_code;
					}
				}
			},
		keyup:
			function(event) {
				if (event.keyCode === ON_MOD_KEY) {
					ON_MOD_KEY = null;
				}
			},
		mousedown: //disable the scrolling arrows after middle click
			function(event) {
				if (event.button === 1) {
					event.preventDefault();
				}
			},
		mouseout:
			function(event) {
				var _target = getPTag(event.target);

				switch (_target.classList[0]) {
				case 'no-bkmark':
				case 'bkmark':
				case 'folder':
					clearTimeout(HOVER_TIMEOUT);
				}
			},
		mouseover:
			function(event) {
				var _target = getPTag(event.target);

				switch (_target.classList[0]) {
				case 'no-bkmark':
				case 'bkmark':
					HOVER_TIMEOUT = setTimeout(function() {
						resetBox(getBoxNum(_target));
					}, OP_FOLDER_BY ? 500 : 250);
					break;
				case 'folder':
					if (!OP_FOLDER_BY) {
						HOVER_TIMEOUT = setTimeout(function() {
							openFolder(_target.id);
						}, 250);
					}
				}
			},
		mousewheel: //control scrolling speed
			function(event) {
				event.preventDefault();

				var target = event.target;
				while (target.scrollHeight === target.clientHeight) {
					if (target.tagName != 'BODY') {
						target = target.parentNode;
					} else {
						return false;
					}
				}
				target.scrollTop -= (event.wheelDelta / 120 >> 0) * ITEM_HEIGHT;
			}
	});

	//cover when menu show
	MENU_COVER.clickByButton(0, hideMenu);

	/* PmB Functions */
	function clickSwitcher(mouse_button, url) {
		var switcher;
		if (mouse_button === 0) {
			switch (ON_MOD_KEY) {
			case 16:
				switcher = STORAGE.clickByLeftShift;
				break;
			case 17:
				switcher = STORAGE.clickByLeftCtrl;
				break;
			default:
				switcher = STORAGE.clickByLeft;
			}
		} else {
			switcher = STORAGE.clickByMiddle;
		}

		switch (switcher) {
		case 0:
		case 1:
			_tab.update({
				url: url
			});
			break;
		default: //case 2: case 3: case 4:
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

	function createItem(title, url, fn) {
		var box_num = getBoxNum(TARGET_ITEM);
		
		_bookmark.create({
			parentId: BOX_PID[box_num],
			title: title,
			url: url,
			index: getTargetIndex()
		}, function(new_obj) {
			genItem(box_num, new_obj).after(TARGET_ITEM);
			
			if ( TARGET_ITEM.hvClass('no-bkmark') ) {
				TARGET_ITEM.rm(); //delete no-bkmark's element
			}
			
			if (!url && fn) {
				fn(new_obj.id);
			}
			
			setHeight(box_num);
			
			if (!url) {
				showEditor( $id(new_obj.id) );
			}

			//scrollAnim(list_addr);
		});
	}

	function dragEndEvent(event) {
		if (DRAG_PLACE.parentNode != PRELOAD) {
			var _this = event.target.before(DRAG_PLACE);
			var _this_id = _this.id;
			var box_num = getBoxNum(_this);
			var no_bkmark = $class('no-bkmark', BOX[box_num])[0];

			if (no_bkmark) {
				no_bkmark.rm();
			}

			PRELOAD.appendChild(DRAG_PLACE);
			
			_bookmark.move(_this_id, {
				parentId: BOX_PID[box_num],
				index: 0
			}); //to re-index all items first
			_bookmark.move(_this_id, {
				index: get$Index(_this) + 1 - (box_num === 0 ? TREE_LEN - 1 : 0)
			}); //+1 because when two items with same index, the new one will -1
		}

		SEARCH_INPUT.focus();
		if (DRAG_ITEM.parentNode === PRELOAD) {
			DRAG_ITEM.rm();
		}
		DRAG_ITEM = null;
	}

	function dragEnterEvent(event) {
		var _this = event.target;

		if (['P', 'HR'].hv(_this.tagName) && DRAG_ITEM !== null) {
			clearTimeout(DRAG_TIMEOUT);
			DRAG_TIMEOUT = setTimeout(function(){
				var _this_id = _this.id;
				var box_num = getBoxNum(_this);

				if (![_this_id, (_this.previousElementSibling || {}).id].hv(DRAG_ITEM.id)) {
					if (_this_id > TREE_LEN || _this_id === '') {
						DRAG_PLACE.before(_this);
					} else {
						PRELOAD.appendChild(DRAG_PLACE);
					}

					if ( _this.hvClass('folder') ) {
						openFolder(_this_id);
						return false;
					}
				} else {
					PRELOAD.appendChild(DRAG_PLACE);
				}
				resetBox(box_num);
			}, 100);
		}
	}

	function dragStartEvent(event) {
		var _target = event.target;
		var box_num = getBoxNum(_target);
		
		if (_target.tagName !== 'P' || _target.id === '') {
			return false;
		}
		
		DRAG_ITEM = _target;
		
		if (box_num === BOX.length) { //if there is next box
			genNinja(box_num).hide();
			genNinja(box_num + 1);
		}
	}

	function expandWidth(expand) {
		if (IS_EXPANDED !== expand) {
			IS_EXPANDED = expand;
			BODY_STYLE.width = getNowWidth() + 'px';
		}
	}

	function genFirstBox() {
		if (BOX[0]) {
			getBoxList(0).clear();
			return false;
		}

		var box_child =
			(BOX[0] = BOX_TEMPLATE.clone(CONTAINER[0]))
				.children;

		box_child[0].rm();
		box_child[0].addClass(0);
	}

	function genFirstList() {
		genFirstBox();
		_bookmark.getChildren('0', function(tree) {
			TREE_LEN = tree.length;

			tree.ascEach(function(stem, stem_num) {
				if (stem_num !== DEF_EXPAND - 1) {
					if (stem_num === 2 && STORAGE.hideMobile) {
						return --TREE_LEN;
					}
					genItem(0, stem).addClass('rootfolder');
				}
			});
		});

		_bookmark.getChildren(DEF_EXPAND + '', function(twig) {
			genList(0, twig);
		});
	}

	function genItem(box_num, node) {
		var new_item = ITEM.clone(getBoxList(box_num));
		var id = new_item.id = node.id;
		var title = node.title;
		var url = node.url;

		new_item.lastChild.innerText = title || url || '';

		if (id <= TREE_LEN || SEARCHING) {
			new_item.draggable = false;
		}
		
		if (url !== SEPARATE_THIS) {
			if (!url) {
				//for Folder
				new_item.className = 'folder';
			} else {
				//for Bookmark
				new_item.className = !SEARCHING ? 'bkmark' : 'result';

				new_item.firstChild.src = 'chrome://favicon/' + url;
				setTooltip(new_item, title, url);
			}
		} else {
			//for Separator
			new_item.className = 'bkmark separator';
		}
		
		return new_item;
	}

	function genList(box_num, twig) {
		twig.ascEach(function(leaf) {
			genItem(box_num, leaf);
		});
		THE_END.clone(getBoxList(box_num));
		setHeight(box_num);
	}

	function genMenu(menu_num, menu_list) {
		var menu = MENU[menu_num] = BODY.$new('div').prop({ className: 'menu' }).hide();
		var area = menu.$new('div');
		var item_class = 0;

		menu_list.push('del', '', 'cut', 'copy', 'paste', '', 'addPage', 'addFolder', 'addSeparator');
		menu_list.ascEach(function(item) {
			if (item === '') {
				area = menu.$new('div');
				area.$new('hr');
			} else {
				area.$new('p').prop({
					className: item_class++,
					innerText: _getMsg(item)
				});
			}
		});

		//Menu's event
		menu.on('click', menuEvent);
	}

	function genNinja(box_num) {
		return NINJA_LIST[box_num] = NINJA.clone(BOX[box_num]);
	}
	
	function greyMenuItem(menu, grey_arr, is_grey) {
		grey_arr.ascEach(function(item_num) {
			menu.children[item_num].toggleClass('grey-item', is_grey);
		});
	}

	function getBoxList(box_num) {
		return $class('folderlist', BOX[box_num])[0];
	}

	function getBoxNum(id) {
		return id != DEF_EXPAND ? parseInt( (typeof id != 'object' ? $id(id) : id).parentNode.classList[1] ) : 0;
	}
	
	function getMaxHeight() {
		return HEIGHT_LIST.max();
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
	
	function getTargetIndex() {
		return TARGET_ITEM.hvClass('no-bkmark') ? 0 : get$Index(TARGET_ITEM) + 1 - (getBoxNum(TARGET_ITEM) === 0 ? TREE_LEN - 1 : 0)
	}

	function hideMenu(is_hide_cover) {
		MENU[MENU_NUM].hide();
		BODY_STYLE.width = getNowWidth() + 'px'; //temp
		TARGET_ITEM.rmClass('selected'); //temp

		if (is_hide_cover !== false) {
			opacityAnim(EDITOR, 0);
			opacityAnim(MENU_COVER, 0);
			modBodyH( getMaxHeight() ); //temp
			SEARCH_INPUT.focus();
		}
	}

	function menuEvent(event) {
		if (event.button === 1) {
			return false;
		}

		var _target = event.target;
		var menu_item_num = parseInt(_target.className);
		var node_id;
		var target_item_id = TARGET_ITEM.id;

		switch (menu_item_num) {
		default: //case 1, 2:
			openBkmarks(target_item_id, MENU_NUM, menu_item_num);
			break;
		case 3:
			showEditor(TARGET_ITEM);
			return false;
		case 4:
			removeItem(target_item_id);
			break;
		case 5:
		case 6:
		case 7:
			if ( _target.hvClass('grey-item') ) {
				return false;
			}
			
			if (menu_item_num === 7) {
				pasteItem(COPY_CUT_ITEM.id);
			} else {
				COPY_CUT_ITEM.isCut = menu_item_num === 5;
				COPY_CUT_ITEM.id = target_item_id;
			}
			break;
		case 8:
			_tab.query({
				currentWindow: true,
				active: true
			}, function(tab) {
				createItem(tab[0].title, tab[0].url);
			});
			break;
		case 9:
			createItem( _getMsg('newFolder') );
			return false;
		case 10:
			createItem('- '.repeat(54), SEPARATE_THIS);
		}

		hideMenu();
	}

	function modBodyH(new_height) {
		BODY_STYLE.height = new_height + 'px';
	}

	function openBkmarks(target_id, menu_num, menu_item_num) {
		_bookmark[menu_num === 0 ? 'getSubTree' : 'get'](target_id, function(node) {
			var url_list = [], url_list_len = 0;

			if (menu_num === 0) {
				node[0].children.ascEach(function(bkmark) {
					if (url_list[url_list_len] = bkmark.url) {
						++url_list_len;
					}
				});

				if ( STORAGE.warnOpenMany && url_list_len > 5 && !confirm( _getMsg('askOpenAll', url_list_len + '') ) ) {
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
					incognito: menu_item_num === 1 ? false : true
				});
			}
		});
	}

	function openFolder(id) {
		if ( BOX_PID.hv(id) ) {
			return false;
		}

		_bookmark.getChildren(id, function(twig) {
			var box_num = getBoxNum(id);
			var next_box_num = box_num + 1;
			var pre_box_num = box_num - 1;
			var next_box = BOX[next_box_num];
			var folder_cover;
			var folder_cover_fn;

			BOX_PID[next_box_num] = id;
			if (next_box) {
				if (DRAG_ITEM !== null) { //test
					PRELOAD.appendChild(DRAG_ITEM);
				}
				next_box.rm();
			}
			next_box = BOX[next_box_num] = BOX_TEMPLATE.clone(CONTAINER[next_box_num % 2]);
			next_box.style.zIndex = next_box_num / 2 >>0;

			next_box.children[0].innerText = $id(id).innerText;
			getBoxList(next_box_num).addClass(next_box_num);

			genList(next_box_num, twig);

			if (box_num > 0 && pre_box_num >= NINJA_LIST.length) {
				folder_cover = genNinja(pre_box_num);
				folder_cover_fn = function() {
					resetBox(pre_box_num);
				};
				
				folder_cover
					.clickByButton(0, folder_cover_fn)
					.hoverTimeout(folder_cover_fn, 300, 10);
			}

			expandWidth(true);
		});
	}
	
	function pasteItem(node_id) {
		if (COPY_CUT_ITEM.isCut) {
			var box_num = getBoxNum(TARGET_ITEM);
			_bookmark.move(node_id, {
				parentId: BOX_PID[box_num],
				index: 0
			}); //to re-index all items first
			_bookmark.move(node_id, {
				index: getTargetIndex()
			}, function(moved_item) {
				( $id(moved_item.id) || genItem(box_num, moved_item) ).after(TARGET_ITEM);
			});
		} else {
			_bookmark.get(node_id, function(node) {
				node = node[0];
				var create_child = function(old_id, new_id) {
						_bookmark.getChildren(old_id, function(folder_tree) {
							folder_tree.ascEach(function(item) {
								_bookmark.create({
									parentId: new_id,
									title: item.title,
									url: item.url
								}, function(new_item) {
									if (!item.url) {
										create_child(item.id, new_item.id);
									}
								});
							});
						});
					}
				
				createItem(node.title, node.url, function(folder_id) {
					create_child(node_id, folder_id);
				});
			});
		}
	}
	
	function removeItem(item_id) {
		_bookmark.get(item_id, function(node) {
			var item = $id(item_id);
			var is_folder = !node[0].url;
			var box_num;
			
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
				setHeight(box_num);
			}
		});
	}

	function resetBox(level) {
		if (!SEARCHING && level === BOX.length - 1) { //if no next list
			return false;
		}
		
		if (DRAG_ITEM !== null) { //test
			PRELOAD.appendChild(DRAG_ITEM);
		}

		if (level === 0) {
			expandWidth(false);
		}

		NINJA_LIST.descEach(function() {
			opacityAnim(NINJA_LIST.pop(), -1);
		}, level - 1);

		BOX.descEach(function() {
			opacityAnim(BOX.pop(), -1);
			BOX_PID.pop();
			HEIGHT_LIST.pop();
		}, level + 1);

		modBodyH( getMaxHeight() );
	}

	function searchHandler() {
		var keyword = SEARCH_INPUT.value;

		if (keyword === '') {
			searchSwitch(false);
			return false;
		}

		if (!SEARCHING) {
			searchSwitch(true);
		}

		_bookmark.search(keyword, function(results) {
			var result_list = getBoxList(0);

			update$(result_list, results, function(item) {
				genItem(0, item);
			}, STORAGE.maxResults);

			setHeight(0);
		});
	}

	function searchSwitch(searching) {
		if (SEARCHING = searching) {
			resetBox(0);
			THE_END.clone( getBoxList(0).clear() );
		} else {
			genFirstList();
		}
	}

	function selectSearch(event) {
		if (event.target.type != 'text' && MENU_COVER.hidden) {
			SEARCH_INPUT.focus();
		}
	}

	function setBottomRight(settler, set_bottom, set_right) {
		settler.style.prop({
			bottom: (set_bottom > 0 ? set_bottom : 0) + 'px',
			right: (set_right > 0 ? set_right : 0) + 'px'
		});
	}

	function setHeight(box_num) {
		var basic_item_num = !SEARCHING && box_num === 0 ? TREE_LEN - 1 : 0;
		var excess_height = box_num % 2 === 0 ? 24 : 0;
		var list_addr = getBoxList(box_num);
		var list_height;
		var list_last_item = list_addr.lastChild;
		var max_list_height = MAX_HEIGHT - excess_height;

		if (list_addr.children.length === basic_item_num + 1) {
			if (!SEARCHING) {
				NOBKMARK.clone(list_addr).before(basic_item_num);
			} else {
				NORESULT.clone(list_addr).before(0).id = 'no-result'; //id for update$()
			}
		}

		list_height = list_last_item.offsetTop + list_last_item.offsetHeight;
		if (list_height > max_list_height) {
			list_height = max_list_height;
		}
		if (list_height === max_list_height) {
			list_addr.style.height = list_height + 'px';
		}
		
		list_height += excess_height;
		if (list_height > MAX_HEIGHT) {
			list_height = MAX_HEIGHT;
		}

		HEIGHT_LIST[box_num] = list_height;
		list_height = getMaxHeight();
		if ( list_height !== getNowHeight() ) {
			modBodyH(list_height);
		}
	}

	function setTooltip(item, title, url) {
		if (STORAGE.tooltip) {
			item.title = title + '\n' + url; //display tooltip, but not stylish
		}
	}

	function showEditor(tar_item){
		hideMenu(false);
		EDITOR.hide(false);
		TARGET_ITEM = tar_item;
		
		_bookmark.get(tar_item.id, function(bkmark) {
			var editor_child = $id('edit-header').children;
			var div_child = $id('edit-input').children;
			var url = bkmark[0].url;

			editor_child[0].innerText = _getMsg(url ? 'edit' : 'rename').replace('...', '');
			editor_child[1].innerText = div_child[0].value = bkmark[0].title;
			div_child[0].focus();
			div_child[1].hide(!url).value = url;

			setBottomRight(
				EDITOR,
				getNowHeight() - EDITOR.offsetHeight - get$Top(tar_item),
				getBoxNum(tar_item) % 2 === 1 ? SET_WIDTH + 2 : 0
			);
		});
	}
});