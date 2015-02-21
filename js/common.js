'use strict';
!function(window, document, Math, undefined) {
  var EMPTY_FUNC = function() {};
  var OBJECT_PROTO = Object.prototype;
  var TIMEOUT_HANDLER = {};

  // Object.prototype
  OBJECT_PROTO.propEach = function(fn) {
    for (var prop_arr = Object.keys(this), prop_name;
         prop_name = prop_arr.shift();
         fn(prop_name, this[prop_name])) {}
  };

  OBJECT_PROTO.prop = function(val1, val2) {
    var _this = this;
    if (typeof val1 === 'object') {
      var isnt_deep_scan = val2 !== true;
      val1.propEach(function(dna, heredity) {
        if (isnt_deep_scan ||
            typeof heredity !== 'object' ||
            heredity === null) {
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

  OBJECT_PROTO.prop({
    ascEach: function(fn, max_length) {
      var _this = this, end = _this.length, i = 0;
      if (end > max_length) {
        end = max_length;
      }
      while (i < end && fn(_this[i], i++) !== false) {}
    },
    descEach: function(fn, end) {
      var _this = this, i = _this.length;
      if (end === undefined || end < 0) {
        end = 0;
      }
      while (--i >= end && fn(_this[i], i) !== false) {}
    },
    getEach: function(prop) {
      var new_arr = [];
      this.ascEach(function(item) {
        new_arr.push(item[prop]);
      });
      return new_arr;
    },
    hv: function(i) {
      var _this = this;
      return _this.indexOf ? _this.indexOf(i) >= 0 : _this[i] !== undefined;
    },
    isEmpty: function() {
      return Object.keys(this).length === 0;
    },

    // Event Management
    clickByButton: function(allow_button, fn) {
      return this.on('click', function(event) {
        if (allow_button === event.button) {
          fn(event);
        }
      });
    },
    hoverTimeout: function(fn, timeout, xy_range, is_inside_range) {
      var _this = this;
      var event_timer;
      var mouse_xy;

      var mousemove_fn = function(mouse_xy_org) {
        var is_trigger_point = function(x_or_y) {
          var displacement = Math.abs(mouse_xy[x_or_y] - mouse_xy_org[x_or_y]);
          return displacement < xy_range === is_inside_range;
        };

        event_timer = setTimeout(function() {
          if (document.contains(_this)) {
            if (is_inside_range ?
                  is_trigger_point(0) && is_trigger_point(1) :
                  is_trigger_point(0) || is_trigger_point(1)) {
              fn(event);
              event_timer = null;
            } else {
              mousemove_fn(mouse_xy);
            }
          }
        }, timeout);
      };

      if (is_inside_range === undefined) {
        is_inside_range = true;
      }

      _this.on({
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

      return _this;
    },
    on: function(events, event_fn, bubble) {
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
    once: function(events, event_fn, bubble) {
      var _this = this;
      var event_tmp_fn = function(e) {
        event_fn(e);
        _this.removeEventListener(events, event_tmp_fn);
      };

      return _this.on(events, event_tmp_fn, bubble);
    },
    ready: function(fn) {
      var _this = this;
      if (/^loaded|^c/.test(_this.readyState)) {
        fn();
      } else {
        _this.once('DOMContentLoaded', function() {
          fn();
        });
      }

      return _this;
    }
  });

  // HTMLElement.prototype
  HTMLElement.prototype.prop({
    // Element Management
    // Element Selectors
    class$: function(class_name) {
      return class$(class_name, this);
    },
    new$: function(tag_name) {
      return new$(tag_name).appendTo(this);
    },
    query$: function(query_str) {
      return query$(query_str, this);
    },
    tag$: function(tag_name) {
      return tag$(tag_name, this);
    },

    // Element Modifier
    addText: function(content) {
      this.appendChild(document.createTextNode(content));
      return this;
    },
    after: function(after_element) {
      var _this = this, next_sibling = after_element.nextSibling;
      return next_sibling ?
        _this.before(next_sibling) :
        _this.appendTo(after_element.parentNode);
    },
    attr: function(val1, val2) {
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
    appendTo: function(father) {
      return father.appendChild(this);
    },
    before: function(before_element) {
      var father, sons;
      if (typeof before_element === 'number') {
        sons = (father = this.parentNode).children;
        before_element = sons[before_element < 0 ?
          sons.length - 1 + before_element :
          before_element];
      } else {
        father = before_element.parentNode;
      }
      return father.insertBefore(this, before_element);
    },
    cloneTo: function(father, grandson) {
      return this.cloneNode(grandson !== false).appendTo(father);
    },
    data: function(name, val) {
      var _this = this;
      var setDataset = function(name, val) {
        _this.dataset[name] = val;
      };

      if (typeof name === 'object') {
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
    empty: function() {
      for (var father = this, sacrifice;
           sacrifice = father.firstChild;
           father.removeChild(sacrifice)) {}
      return father;
    },
    first: function() {
      return this.firstElementChild;
    },
    last: function() {
      return this.lastElementChild;
    },
    next: function() {
      return this.nextElementSibling;
    },
    prev: function() {
      return this.previousElementSibling;
    },
    rm: function() {
      var _this = this;
      if (document.contains(_this)) {
        _this.parentNode.removeChild(_this);
      }
    },
    selectText: function() {
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
    val: function(new_value) {
      this.value = new_value;
      return this;
    },

    // Class Management
    addClass: function(class_name) {
      return classListFn(this, 'add', class_name);
    },
    hvClass: function(class_name) {
      return this.classList.contains(class_name);
    },
    rmClass: function(class_name) {
      return classListFn(this, 'remove', class_name);
    },
    toggleClass: function(class_name, switcher) {
      var class_fn_name = switcher === undefined ?
        'toggle' :
        switcher ?
          'add' :
          'remove';
      return classListFn(this, class_fn_name, class_name);
    },

    // Style Handler
    css: function(val1, val2) {
      var _this = this;

      if (typeof val1 !== 'object' && val2 === undefined) {
        return getComputedStyle(_this)[val1];
      }

      _this.style.prop(val1, val2);
      return _this;
    },
    hide: function() {
      this.hidden = true;
      return this;
    },
    offset: function() {
      var check_element = this;
      var offset_top = check_element.offsetTop;
      var offset_left = check_element.offsetLeft;
      while (check_element.tagName !== 'BODY') {
        if (check_element.css('position') === 'absolute') {
          offset_top += check_element.offsetTop;
          offset_left += check_element.offsetLeft;
        }
        offset_top -= check_element.scrollTop;
        offset_left -= check_element.scrollLeft;

        check_element = check_element.parentNode;
      }

      return {
        top: offset_top,
        left: offset_left
      };
    },
    show: function() {
      var _this = this;

      _this.hidden = false;
      if (_this.style.display === 'none') {
        _this.style.display = '';
      }

      return _this;
    },

    // Others
    index: function() {
      for (var index_num = 0, indexer = this;
        indexer = indexer.previousElementSibling;
        ++index_num) {}
      return index_num;
    },
    hvFocus: function() {
      return document.activeElement === this;
    },

    // Animation
    anim: function(style_name, style_val) {
      var _args = argumentsConstructor(
        arguments, ['number', 'function'], [400, EMPTY_FUNC]
      );
      var duration = _args[0];
      var complete_fn = _args[1];

      var _this = this;
      var _this_style = _this.style;

      _this_style.WebkitTransition = style_name + ' ' + duration + 'ms';

      setTimeout(function() {
        _this_style.WebkitTransition = '';

        complete_fn.call(_this);
      }, duration);

      _this_style[style_name] = style_val;
    },
    fadeOut: function() {
      var _args = argumentsConstructor(
        arguments, ['number', 'boolean'], [400, false]
      );
      var duration = _args[0];
      var is_remove_when_done = _args[1];

      var _this = this;

      _this.anim('opacity', 0, duration, function() {
        if (is_remove_when_done) {
          _this.rm();
        } else {
          _this.hide();
          _this.style.opacity = '';
        }
      });
    }
  });

  // Array.prototype
  Array.prototype.prop({
    max: function() {
      return Math.max.apply(Math, this);
    },
    min: function() {
      return Math.min.apply(Math, this);
    },
    merge: function(arr) {
      var arr2 = [];
      this.ascEach(function(i) {
        if (arr.hv(i)) {
          arr2.push(i);
        }
      });
      return arr2;
    },
    diff: function(arr) {
      var arr2 = [];
      this.ascEach(function(i) {
        if (!arr.hv(i)) {
          arr2.push(i);
        }
      });
      return arr2;
    },
    move: function(old_index, new_index) {
      this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    },
    rm: function(removed_item) {
      var _this = this;
      _this.splice(_this.indexOf(removed_item), 1);
      return _this;
    }
  });

  // String.prototype
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

  // Private function
  function argumentsConstructor(args, type_patterns, default_values) {
    // remove the non-optional arguments
    var args_slice_num = args.length - type_patterns.length;
    if (args_slice_num > 0) {
      args = [].slice.call(args, args_slice_num);
    }

    var arg_index = 0;
    var return_list = [];

    type_patterns.ascEach(function(expected_type, type_index) {
      var this_arg = args[arg_index];
      var this_type = typeof this_arg;

      if (this_type === expected_type) {
        return_list.push(this_arg);
        arg_index++;
      } else {
        return_list.push(default_values[type_index]);
      }
    });

    return return_list;
  }

  function classListFn(_this, fn_name, class_name) {
    _this.classList[fn_name](class_name);
    return _this;
  }

  // Public Functions
  window.prop({
    initTimeout: function(timeout_name, fn, timeout) {
      clearTimeout(TIMEOUT_HANDLER[timeout_name]);
      return TIMEOUT_HANDLER[timeout_name] = setTimeout(fn, timeout);
    },

    // get element
    class$: function(class_name, classroom) {
      return (classroom || document).getElementsByClassName(class_name);
    },
    id$: function(id) {
      return document.getElementById(id);
    },
    name$: function(name) {
      return document.getElementsByName(name);
    },
    new$: function(tag_name) {
      return document.createElement(tag_name);
    },
    query$: function(query_str, query_element) {
      return (query_element || document).querySelectorAll(query_str);
    },
    tag$: function(friend, fb) {
      return (fb || document).getElementsByTagName(friend);
    },

    // set element
    update$: function(swelldom, vogue, catwalk, max_models) {
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
    },

    // AJAX
    Ajax: (function() {
      var genQueryString = function(data) {
        var query = [];
        for (var key in data) {
          query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }

        return query.join('&');
      };

      var sendAjax = function(method, data, options) {
        //// preassign value to options
        var async = options.async !== undefined ? options.async : true;
        var response_type = options.type;
        var url = options.url;

        var complete = options.complete || EMPTY_FUNC;
        var error = options.error || EMPTY_FUNC;
        var success = options.success || EMPTY_FUNC;
        ////

        var xmlhttp = new XMLHttpRequest();

        xmlhttp.open(method, url, async);

        if (response_type) {
          xmlhttp.responseType = response_type;
        }

        if (method === 'POST') {
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

          sendAjax('GET', null, options);
        },
        post: function(options) {
          var querystring = genQueryString(options.data);

          sendAjax('POST', querystring, options);
        }
      };
    })(),

    // set or unset CSS
    Css: (function() {
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
    })()
  });
}(window, document, Math);
