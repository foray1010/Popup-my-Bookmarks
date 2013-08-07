"use strict";
/* Own Library */
(function() {
	var obj_proto = Object.prototype;
	var _doc = document;
	var _math = Math;

	/* Object.prototype */
	obj_proto.prop = function(bloodline) {
		var son = this;
		propEach(bloodline, function(dna, heredity) {
			if (typeof heredity !== 'object' || heredity === null) {
				son[dna] = heredity;
			} else {
				son[dna].prop(heredity);
			}
		});
		return son;
	}

	obj_proto.prop({
		ascEach:
			function(fn, max_length) {
				var _this = this, end = _this.length, i = 0;
				if (end > max_length) {
					end = max_length;
				}
				while (i < end && fn(_this[i], i++) !== false) {}
			},
		descEach:
			function(fn, end) {
				var _this = this, i = _this.length;
				if ( !(end > 0) ) {
					end = 0;
				}
				while (--i >= end && fn(_this[i], i) !== false) {}
			},
		hv:
			function(i) {
				var _this = this;
				return isArr(_this) ? _this.indexOf(i) > -1 : _this[i] !== void 0;
			},
		rmProp:
			function(i) {
				var _this = this;
				var _action = function(i) {
						delete _this[i];
					}
				if ( isArr(i) ) {
					i.ascEach(_action);
				} else {
					_action(i);
				}
				return _this;
			}
	});
	
	/* HTMLElement.prototype */
	HTMLElement.prototype.prop({
		/* Element Management */
		$class:
			function(class_name) {
				return $class(class_name, this);
			},
		$new:
			function(tag_name) {
				return $new(tag_name).appendTo(this);
			},
		$tag:
			function(tag_name) {
				return $tag(tag_name, this);
			},
		addText:
			function(content) {
				this.appendChild( _doc.createTextNode(content) );
				return this;
			},
		after:
			function(after) {
				var _this = this, next_sibling = after.nextSibling;
				return next_sibling ? _this.before(next_sibling) : _this.appendTo(after.parentNode);
			},
		appendTo:
			function(father) {
				return father.appendChild(this);
			},
		before:
			function(before) {
				var father, sons;
				if (typeof before == 'number') {
					sons = (father = this.parentNode).children;
					before = sons[before < 0 ? sons.length - 1 + before : before];
				} else {
					father = before.parentNode;
				}
				return father.insertBefore(this, before);
			},
		clear:
			function() {
				for (var father = this, sacrifice; sacrifice = father.firstChild; father.removeChild(sacrifice)) {}
				return father;
			},
		clone:	
			function(father, grandson) {
				return this.cloneNode(grandson !== false ? true : false).appendTo(father || this.parentNode);
			},
		rm:
			function() {
				_doc.contains(this) && this.parentNode.removeChild(this); // start from Chrome 24 -> this.remove()
			},
		/* Class Management */
		addClass:
			function(class_name) {
				return classListFn(this, 'add', class_name);
			},
		hvClass:
			function(class_name) {
				return this.classList.contains(class_name);
			},
		rmClass:
			function(class_name) {
				return classListFn(this, 'remove', class_name);
			},
		toggleClass:
			function(class_name, switcher) {
				return classListFn(this, switcher === void 0 ? 'toggle' : switcher ? 'add' : 'remove', class_name);
			},
		/* Style Management */
		hide:
			function(param) {
				var _this = this;
				
				if ( isArr(param) ) {
					param.ascEach(function(is_hide, child_num) {
						_this.children[child_num].hidden = is_hide === false ? false : true;
					});
				} else {
					_this.hidden = param === false ? false : true;
				}
				
				return _this;
			},
		/* Event Management */
		clickByButton:
			function(allow_button, fn) {
				return this.on('click', function(event) {
						if (allow_button === event.button) {
							fn(event);
						}
					});
			},
		hoverTimeout:
			function(fn, timeout, xy_range) {
				var event_timer;
				var mouse_xy;
				var _this = this.on({
						mousemove: function(event) {
							mouse_xy = [event.x, event.y];
							if (!event_timer) {
								mousemove_fn(mouse_xy);
							}
						},
						mouseout: function() {
							clearTimeout(event_timer);
							event_timer = null;
						}
					});
				var mousemove_fn = function(mouse_xy_org) {
						event_timer = setTimeout(function() {
							if ( _doc.contains(_this) ) {
								if (_math.abs(mouse_xy[0] - mouse_xy_org[0]) < xy_range && _math.abs(mouse_xy[1] - mouse_xy_org[1]) < xy_range) {
									fn(event);
									event_timer = null;
								} else {
									mousemove_fn(mouse_xy);
								}
							}
						}, timeout);
					};
				return _this;
			},
		on:
			function(events, event_fn, bubble) {
				var _this = this;
				if (event_fn === void 0) {
					propEach(events, function(event_name, event_fn) {
						_this.addEventListener(event_name, event_fn);
					});
				} else {
					_this.addEventListener(events, event_fn, bubble);
				}
				return _this;
			}
	});
	
	/* Array.prototype */
	Array.prototype.prop({
		max:
			function() {
				return _math.max.apply(_math, this);
			},
		min:
			function() {
				return _math.min.apply(_math, this);
			},
		merge:
			function(arr) {
				var arr2 = [];
				this.ascEach(function(i) {
					if ( arr.hv(i) ) {
						arr2.push(i);
					}
				});
				return arr2;
			},
		diff:
			function(arr) {
				var arr2 = [];
				this.ascEach(function(i) {
					if ( !arr.hv(i) ) {
						arr2.push(i);
					}
				});
				return arr2;
			},
		localeSort:
			function() {
				return this.sort(function(str1, str2) {
						return str1.localeCompare(str2);
					});
			}
	});
	
	/* String.prototype */
	String.prototype.repeat = function(times) {
		var result = '', string = this;
		while(times) {
			if (times & 1) {
				result += string;
			}
			if (times >>= 1) {
				string += string;
			}
		}
		return result;
	}
	
	/* Private function */
	function classListFn(_this, fn_name, class_name) {
		_this.classList[fn_name](class_name);
		return _this;
	}
	
	function propEach(obj, fn) {
		for (
			var prop_arr = Object.keys(obj), prop_name;
			prop_name = prop_arr.shift();
			fn(prop_name, obj[prop_name])
		) {}
	}
})();

/* getElement */
function $new(tag_name) {
	return document.createElement(tag_name);
}

function $id(id) {
	return document.getElementById(id);
}

function $name(name) {
	return document.getElementsByName(name);
}

function $class(class_name, classroom) {
	return (classroom || document).getElementsByClassName(class_name);
}

function $tag(friend, fb) {
	return (fb || document).getElementsByTagName(friend);
}

//Element function
function update$(swelldom, vogue, catwalk, max_models) {
	var outdated_list = [];
	var updated_list = [];
	
	swelldom.children.ascEach(function(jeans) {
		if (jeans.id !== '') {
			outdated_list.push(jeans.id);
		}
	});
	
	vogue.ascEach(function(jeans) {
		updated_list.push(jeans.id);
	}, max_models);
	
	outdated_list.diff(updated_list)
		.ascEach(function(old_school) {
			$id(old_school).rm();
		});
	
	updated_list.diff(outdated_list)
		.ascEach(function(season) {
			catwalk(vogue[updated_list.indexOf(season)]);
		});

	updated_list.ascEach(function(jeans_id, season_num) {
		$id(jeans_id).before(season_num);
	});
}

function get$Index(indexer) {
	for (
		var index_num = 0;
		indexer = indexer.previousElementSibling;
		++index_num
	) {}
	return index_num;
}

function get$Top(son) { //this code can be better
	for (
		var top = son.offsetTop;
		(son = son.parentNode).tagName !== 'BODY';
		top += (son.firstElementChild.offsetTop === 0 ? son.offsetTop : 0) - son.scrollTop
		//find firstChild's offset to identify if it is position: absolute
	) {}
	return top;
}

//doesn't work on off-line page when using Chrome
function setCSS(css_name, style_list, css_num) {
	document.styleSheets[css_num || 0].cssRules
		.ascEach(function(css_item) {
			if (css_item.selectorText == css_name) {
				css_item.style.prop(style_list);
				return false;
			}
		});
}

function rand(max, min) {
	return (min || (min = 0)) + (Math.random() * (max + 1 - min) >> 0);
}

/* Array function */
function isArr(obj) {
	return Array.isArray(obj);
}

/* Animation */
function opacityAnim(hollowman, end, timer) {
	var hollowstyle = hollowman.style;
	var is_del;

	if (end === -1) {
		is_del = true;
		end = 0;
	}

	setTimeout(function() {
		if (end === 0) {
			if (is_del) {
				hollowman.rm();
				return false;
			}
			hollowman.hide();
			hollowstyle.opacity = null;
		}
		hollowstyle.WebkitTransition = null;
	}, timer || (timer = 300));

	hollowstyle.WebkitTransition = 'opacity ' + timer + 'ms';
	hollowstyle.opacity = end;
}

function scrollAnim(scroller, expected_height) {
	function _anim() {
		scroller.scrollTop = (now += jump);
		if (--timer) {
			setTimeout(_anim, 20);
		}
	}

	var hill = (expected_height || scroller.scrollHeight) - scroller.clientHeight;
	var now = scroller.scrollTop;
	var jump;
	var timer = 5;

	if (hill !== now) {
		jump = -~((hill - now) / timer);
		setTimeout(_anim, 20);
	}
}