'use strict';
/* Own Library */
var initTimeout;

!function() {
  var obj_proto = Object.prototype;
  var _doc = document;
  var _math = Math;

  var TIMEOUT_HANDLER = {};

  /* Public Functions */
  initTimeout = function(timeout_name, fn, timeout) {
    clearTimeout(TIMEOUT_HANDLER[timeout_name]);
    TIMEOUT_HANDLER[timeout_name] = setTimeout(fn, timeout);
  };

  /* Object.prototype */
  obj_proto.propEach = function(fn) {
    for (var prop_arr = Object.keys(this), prop_name;
         prop_name = prop_arr.shift();
         fn(prop_name, this[prop_name])) {}
  };

  obj_proto.prop = function(val1, val2) {
    var _this = this;
    if (val2 === undefined) {
      val1.propEach(function(dna, heredity) {
        if (!isObj(heredity) || heredity === null) {
          _this[dna] = heredity;
        } else {
          _this[dna].prop(heredity);
        }
      });
    } else {
      _this[val1] = val2;
    }
    return _this;
  };

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
        if (!(end > 0)) {
          end = 0;
        }
        while (--i >= end && fn(_this[i], i) !== false) {}
      },
    getEach:
      function(prop) {
        var new_arr = [];
        this.ascEach(function(item) {
          new_arr.push(item[prop]);
        });
        return new_arr;
      },
    hv:
      function(i) {
        var _this = this;
        return _this.indexOf ? _this.indexOf(i) >= 0 : _this[i] !== undefined;
      },
    isEmpty:
      function() {
        return Object.keys(this).length === 0;
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
      function(fn, timeout, xy_range, is_inside_range) {
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
          var is_xy_not_allow = function(x_or_y) {
            return (_math.abs(mouse_xy[x_or_y] - mouse_xy_org[x_or_y]) < xy_range) === is_inside_range;
          };
          event_timer = setTimeout(function() {
            if (_doc.contains(_this)) {
              if (is_inside_range ? is_xy_not_allow(0) && is_xy_not_allow(1) : is_xy_not_allow(0) || is_xy_not_allow(1)) {
                fn(event);
                event_timer = null;
              } else {
                mousemove_fn(mouse_xy);
              }
            }
          }, timeout);
        };
        if (is_inside_range === undefined) {
          is_inside_range = false;
        }
        return _this;
      },
    on:
      function(events, event_fn, bubble) {
        var _this = this;
        var addEvent = function(event_name, event_fn, bubble) {
          _this.addEventListener(event_name, event_fn, bubble);
        };

        if (event_fn === undefined) {
          events.propEach(addEvent);
        } else {
          addEvent(events, event_fn, bubble);
        }
        return _this;
      },
    once:
      function(events, event_fn, bubble) {
        var _this = this;
        var event_tmp_fn = function(e) {
          event_fn(e);
          _this.removeEventListener(events, event_tmp_fn);
        };

        return _this.on(events, event_tmp_fn, bubble);
      },
    ready:
      function(fn) {
        var _doc = this;
        if (/^loaded|^c/.test(_doc.readyState)) {
          fn();
        } else {
          _doc.once('DOMContentLoaded', function() {
            fn();
          });
        }
      }
  });

  /* HTMLElement.prototype */
  HTMLElement.prototype.prop({
    /* Element Management */
    //// Element Selectors
    class$:
      function(class_name) {
        return class$(class_name, this);
      },
    new$:
      function(tag_name) {
        return new$(tag_name).appendTo(this);
      },
    tag$:
      function(tag_name) {
        return tag$(tag_name, this);
      },
    ////
    addText:
      function(content) {
        this.appendChild(_doc.createTextNode(content));
        return this;
      },
    after:
      function(after_element) {
        var _this = this, next_sibling = after_element.nextSibling;
        return next_sibling ? _this.before(next_sibling) : _this.appendTo(after_element.parentNode);
      },
    attr:
      function(val1, val2) {
        var _this = this;
        var _action = function(name, val) {
          _this.setAttribute(name, val);
        };
        if (val2 === undefined) {
          val1.propEach(_action);
        } else {
          _action(val1, val2);
        }
        return _this;
      },
    appendTo:
      function(father) {
        return father.appendChild(this);
      },
    before:
      function(before_element) {
        var father, sons;
        if (typeof before_element == 'number') {
          sons = (father = this.parentNode).children;
          before_element = sons[before_element < 0 ? sons.length - 1 + before_element : before_element];
        } else {
          father = before_element.parentNode;
        }
        return father.insertBefore(this, before_element);
      },
    cloneTo:
      function(father, grandson) {
        return this.cloneNode(grandson !== false).appendTo(father);
      },
    data:
      function(name, val) {
        var _this = this;
        var setDataset = function(name, val) {
          _this.dataset[name] = val;
        };

        if (isObj(name)) {
          name.propEach(setDataset);
          return _this;
        }

        if (val !== undefined) {
          if (val === null) {
            delete _this.dataset[name];
          } else {
            setDataset(name, val);
          }
          return _this;
        }

        return _this.dataset[name];
      },
    empty:
      function() {
        for (var father = this, sacrifice; sacrifice = father.firstChild; father.removeChild(sacrifice)) {}
        return father;
      },
    first:
      function() {
        return this.firstElementChild;
      },
    last:
      function() {
        return this.lastElementChild;
      },
    next:
      function() {
        return this.nextElementSibling;
      },
    prev:
      function() {
        return this.previousElementSibling;
      },
    rm:
      function() {
        var _this = this;
        _doc.contains(_this) && _this.parentNode.removeChild(_this);
      },
    selectText:
      function() {
        var _this = this;

        if (_this.tagName === 'INPUT') {
          _this.setSelectionRange(0, _this.value.length);
        } else {
          var range = document.createRange();
          var selection = window.getSelection();

          range.selectNodeContents(_this);

          selection.removeAllRanges();
          selection.addRange(range);
        }

        return _this;
      },
    val:
      function(new_value) {
        this.value = new_value;
        return this;
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
        return classListFn(this, switcher === undefined ? 'toggle' : switcher ? 'add' : 'remove', class_name);
      },
    /* Style Management */
    css:
      function(param1, param2) {
        this.style.prop(param1, param2);
        return this;
      },
    hide:
      function() {
        this.hidden = true;
        return this;
      },
    show:
      function() {
        var _this = this;

        _this.hidden = false;
        if (_this.style.display == 'none') {
          _this.style.display = '';
        }

        return _this;
      },
    /* Others */
    index:
      function() {
        for (var index_num = 0, indexer = this;
          indexer = indexer.previousElementSibling;
          ++index_num) {}
        return index_num;
      },
    hvFocus:
      function() {
        return _doc.activeElement === this;
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
          if (arr.hv(i)) {
            arr2.push(i);
          }
        });
        return arr2;
      },
    diff:
      function(arr) {
        var arr2 = [];
        this.ascEach(function(i) {
          if (!arr.hv(i)) {
            arr2.push(i);
          }
        });
        return arr2;
      },
    move:
      function(old_index, new_index) {
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
      },
    rm:
      function(removed_item) {
        var _this = this;
        _this.splice(_this.indexOf(removed_item), 1);
        return _this;
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
  };

  /* Private function */
  function classListFn(_this, fn_name, class_name) {
    _this.classList[fn_name](class_name);
    return _this;
  }
}();

/* getElement */
function new$(tag_name) {
  return document.createElement(tag_name);
}

function id$(id) {
  return document.getElementById(id);
}

function name$(name) {
  return document.getElementsByName(name);
}

function class$(class_name, classroom) {
  return (classroom || document).getElementsByClassName(class_name);
}

function tag$(friend, fb) {
  return (fb || document).getElementsByTagName(friend);
}

// AJAX
var Ajax = (function() {
  var genQueryString = function(data) {
    var query = [];
    for (var key in data) {
      query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }

    return query.join('&');
  };

  var send = function(method, data, options) {
    //// preassign value to options
    var empty_fn = function() {};

    var async = options.async !== undefined ? options.async : true;
    var response_type = options.type;
    var url = options.url;

    var complete = options.complete || empty_fn;
    var error = options.error || empty_fn;
    var success = options.success || empty_fn;
    ////

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open(method, url, async);

    if (response_type) {
      xmlhttp.responseType = response_type;
    }

    if (method == 'POST') {
      xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4) {
        var response = xmlhttp.response;

        if (xmlhttp.status === 200) {
          success(response);
        } else {
          error(response);
        }

        complete();
      }
    };

    xmlhttp.send(data);
  };

  return {
    get: function(options) {
      var querystring = genQueryString(options.data);
      if (querystring) {
        options.url += '?' + querystring;
      }

      send('GET', null, options);
    },
    post: function(options) {
      var querystring = genQueryString(options.data);

      send('POST', querystring, options);
    }
  };
})();

// set or unset CSS
var Css = (function() {
  var getSheet = function() {
    var _jets_css = '_jets-css';
    var style_element = id$(_jets_css) || document.head.new$('style').prop('id', _jets_css);
    return style_element.sheet;
  };

  var set = function(css_name, style_list) {
    var _action = function(css_name, style_list) {
      var sheet = getSheet();
      style_list.propEach(function(prop_name, prop_val) {
        sheet.addRule(css_name, prop_name + ':' + prop_val);
      });
    };

    if (style_list === undefined) {
      css_name.propEach(_action);
    } else {
      _action(css_name, style_list);
    }
  };

  var unsetAll = function() {
    var sheet = getSheet();
    sheet.rules.descEach(function(rule_num) {
      sheet.deleteRule(rule_num);
    });
  };

  return {
    set: set,
    unsetAll: unsetAll
  };
})();

// Element function
function getRealTop(son) { // this code can be better
  for (var top = son.offsetTop;
       (son = son.parentNode).tagName !== 'BODY';
       // find firstChild's offset to identify if it is position: absolute
       top += (son.first().offsetTop === 0 ? son.offsetTop : 0) - son.scrollTop) {}
  return top;
}

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
      id$(old_school).rm();
    });

  updated_list.diff(outdated_list)
    .ascEach(function(season) {
      catwalk(vogue[updated_list.indexOf(season)]);
    });

  updated_list.ascEach(function(jeans_id, season_num) {
    id$(jeans_id).before(season_num);
  });
}

/* Check function */
function isArr(obj) {
  return Array.isArray(obj);
}

function isObj(obj) {
  return typeof obj == 'object';
}

/* Animation */
function opacityAnim(hollowman, end, timer) {
  var hollowstyle = hollowman.style;
  var is_del;

  if (end === -1) {
    is_del = true;
    end = 0;
  }

  if (!timer) {
    timer = 300;
  }

  hollowstyle.WebkitTransition = 'opacity ' + timer + 'ms';
  setTimeout(function() {
    if (end === 0) {
      if (is_del) {
        hollowman.rm();
        return false;
      }
      hollowman.hide();
      hollowstyle.opacity = '';
    }
    hollowstyle.WebkitTransition = '';
  }, timer);

  hollowstyle.opacity = end;
}
