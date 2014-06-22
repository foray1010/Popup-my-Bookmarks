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
  
  // function protoFnHandler(fn) {
  //   return function() {
  //     var _arg = arguments;
  //     var _this = this;
  //     if (_arg[1] === void 0) {
  //       _arg[0].propEach(function() {
  //         fn.apply(_this, arguments);
  //       });
  //     } else {
  //       fn.apply(_this, _arg);
  //     }
  //     return _this;
  //   };
  // }

  /* Object.prototype */
  obj_proto.propEach = function(fn) {
    for (var prop_arr = Object.keys(this), prop_name;
         prop_name = prop_arr.shift();
         fn(prop_name, this[prop_name])) {}
  };
  
  obj_proto.prop = function(val1, val2) {
    var _this = this;
    if (val2 === void 0) {
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
        return _this.indexOf ? _this.indexOf(i) > -1 : _this[i] !== void 0;
      },
    isEmpty:
      function() {
        return Object.keys(this).length === 0;
      },
    // toggle:
    //   function(prop_name, val1, val2) {
    //     var _this = this, current_val = _this[prop_name];
    //     if (current_val === val1) {
    //       _this[prop_name] = val2;
    //     } else if(current_val === val2) {
    //       _this[prop_name] = val1;
    //     }
    //     return _this[prop_name];
    //   },
    rmProp:
      function(i) {
        var _this = this;
        var _action = function(i) {
              delete _this[i];
            };
        if (isArr(i)) {
          i.ascEach(_action);
        } else {
          _action(i);
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
        if (is_inside_range === void 0) {
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

        if (event_fn === void 0) {
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
    cloneTo:  
      function(father, grandson) {
        return this.cloneNode(grandson !== false ? true : false).appendTo(father);
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
        
        if (val !== void 0) {
          if (val === null) {
            delete _this.dataset[name];
          } else {
            setDataset(name, val);
          }
          return _this;
        }
        
        return _this.dataset[name];
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
        _doc.contains(this) && this.parentNode.removeChild(this); // start from Chrome 24 -> this.remove()
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
        return classListFn(this, switcher === void 0 ? 'toggle' : switcher ? 'add' : 'remove', class_name);
      },
    /* Style Management */
    css:
      function(param1, param2) {
        this.style.prop(param1, param2);
        return this;
      },
    hide:
      function(param) {
        var _this = this;
        
        if (isArr(param)) {
          param.ascEach(function(is_hide, child_num) {
            _this.children[child_num].hide(is_hide);
          });
        } else {
          _this.hidden = param !== false;
        }
        
        return _this;
      },
    opacity:
      function(value) {
        return this.css('opacity', value);
      },
    /* other */
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

//Element function
function getRealTop(son) { //this code can be better
  for (var top = son.offsetTop;
       (son = son.parentNode).tagName !== 'BODY';
       //find firstChild's offset to identify if it is position: absolute
       top += (son.firstElementChild.offsetTop === 0 ? son.offsetTop : 0) - son.scrollTop) {}
  return top;
}

function setCSS(css_name, style_list) {
  var _action = function(css_name, style_list) {
        style_list.propEach(function(prop_name, prop_val) {
          sheet.addRule(css_name, prop_name + ':' + prop_val);
        });
      };
  var _jets_css = '_jets-css';
  var sheet_element = id$(_jets_css) || document.head.new$('style').prop({ id: _jets_css });
  var sheet = sheet_element.sheet;
  
  if (style_list === void 0) {
    css_name.propEach(_action);
  } else {
    _action(css_name, style_list);
  }
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
      hollowman.hide().opacity('');
    }
    hollowstyle.WebkitTransition = '';
  }, timer);

  hollowman.opacity(end);
}

// function scrollAnim(scroller, expected_height) {
//   function _anim() {
//     scroller.scrollTop = (now += jump);
//     if (--timer) {
//       setTimeout(_anim, 20);
//     }
//   }

//   var hill = (expected_height || scroller.scrollHeight) - scroller.clientHeight;
//   var now = scroller.scrollTop;
//   var jump;
//   var timer = 5;

//   if (hill !== now) {
//     jump = -~((hill - now) / timer);
//     setTimeout(_anim, 20);
//   }
// }
