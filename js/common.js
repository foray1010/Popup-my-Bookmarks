'use strict';
!function(window, document, Math, Object, undefined) {
  var EMPTY_FUNC = function() {};
  var OBJECT_PROTO = Object.prototype;
  var TIMEOUT_HANDLER = {};

  // Object.prototype
  OBJECT_PROTO.propEach = function(fn) {
    var _this = this;

    var propArr = Object.keys(_this);
    var propName;
    while (propName = propArr.shift()) {
      fn(propName, _this[propName]);
    }
  };

  OBJECT_PROTO.prop = function(val1, val2) {
    var _this = this;
    if (typeof val1 === 'object') {
      var isntDeepScan = val2 !== true;
      val1.propEach(function(dna, heredity) {
        if (isntDeepScan ||
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
    ascEach: function(fn, maxLength) {
      var _this = this;
      var end = _this.length;
      var i = 0;

      if (end > maxLength) {
        end = maxLength;
      }

      while (i < end && fn(_this[i], i++) !== false) {}
    },
    descEach: function(fn, end) {
      var _this = this;
      var i = _this.length;

      if (end === undefined || end < 0) {
        end = 0;
      }

      while (--i >= end && fn(_this[i], i) !== false) {}
    },
    hv: function(i) {
      var _this = this;
      return _this.indexOf ? _this.indexOf(i) >= 0 : _this[i] !== undefined;
    },
    isEmpty: function() {
      return Object.keys(this).length === 0;
    },

    // Event Management
    clickByButton: function(allowButton, fn) {
      var _this = this;
      _this.on('click', function(event) {
        if (allowButton === event.button) {
          fn.call(_this, event);
        }
      });
      return _this;
    },
    hoverTimeout: function(fn, timeout, xyRange, isInsideRange) {
      var _this = this;
      var eventTimer;
      var mouseXY;

      var mousemoveFn = function(mouseXYOrig) {
        var isTriggerPoint = function(axis) {
          var displacement = Math.abs(mouseXY[axis] - mouseXYOrig[axis]);
          return displacement < xyRange === isInsideRange;
        };

        eventTimer = setTimeout(function() {
          if (document.contains(_this)) {
            if (isInsideRange ?
                  isTriggerPoint(0) && isTriggerPoint(1) :
                  isTriggerPoint(0) || isTriggerPoint(1)) {
              fn(event);
              eventTimer = null;
            } else {
              mousemoveFn(mouseXY);
            }
          }
        }, timeout);
      };

      if (isInsideRange === undefined) {
        isInsideRange = true;
      }

      _this.on({
        mousemove: function(event) {
          mouseXY = [event.x, event.y];
          if (!eventTimer) {
            mousemoveFn(mouseXY);
          }
        },
        mouseout: function() {
          clearTimeout(eventTimer);
          eventTimer = null;
        }
      });

      return _this;
    },
    on: function() {
      return eventHandler(this, arguments, false);
    },
    once: function() {
      return eventHandler(this, arguments, true);
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
    class$: function(className) {
      return class$(className, this);
    },
    new$: function(tagName) {
      return new$(tagName).appendTo(this);
    },
    query$: function(queryStr) {
      return query$(queryStr, this);
    },
    tag$: function(tagName) {
      return tag$(tagName, this);
    },

    // Element Modifier
    addText: function(content) {
      this.appendChild(document.createTextNode(content));
      return this;
    },
    after: function(param1) {
      var _this = this;
      var father;
      var nextNextSibling;

      if (typeof param1 === 'number') {
        father = _this.parentNode;
        nextNextSibling = _this.parentNode.children[param1 + 1];
      } else {
        father = param1.parentNode;
        nextNextSibling = param1.next();
      }

      return nextNextSibling ?
        _this.before(nextNextSibling) :
        _this.appendTo(father);
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
    before: function(param1) {
      var _this = this;
      var father;
      var sons;
      if (typeof param1 === 'number') {
        father = _this.parentNode;
        sons = father.children;
        param1 = sons[param1 < 0 ?
          sons.length - 1 + param1 :
          param1];
      } else {
        father = param1.parentNode;
      }
      return father.insertBefore(_this, param1);
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
      var father = this;
      var sacrifice;
      while (sacrifice = father.firstChild) {
        father.removeChild(sacrifice);
      }

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
    val: function(newValue) {
      this.value = newValue;
      return this;
    },

    // Class Management
    addClass: function(className) {
      return classListFn(this, 'add', className);
    },
    hvClass: function(className) {
      return this.classList.contains(className);
    },
    rmClass: function(className) {
      return classListFn(this, 'remove', className);
    },
    toggleClass: function(className, switcher) {
      var classFnName = switcher === undefined ?
        'toggle' :
        switcher ?
          'add' :
          'remove';
      return classListFn(this, classFnName, className);
    },

    // Style Handler
    css: function(val1, val2) {
      var _this = this;

      if (typeof val1 !== 'object' && val2 === undefined) {
        return window.getComputedStyle(_this)[val1];
      }

      _this.style.prop(val1, val2);
      return _this;
    },
    hide: function() {
      this.hidden = true;
      return this;
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
    hvFocus: function() {
      return document.activeElement === this;
    },
    index: function() {
      var indexNum = 0;
      var indexer = this;
      while (indexer = indexer.prev()) {
        indexNum++;
      }

      return indexNum;
    },

    // Animation
    anim: function(styleName, styleValue) {
      var _args = argumentsConstructor(
        arguments, ['number', 'function'], [400, EMPTY_FUNC]
      );
      var duration = _args[0];
      var completeFn = _args[1];

      var _this = this;

      _this.style.transition = styleName + ' ' + duration + 'ms';

      setTimeout(function() {
        _this.style.transition = '';

        completeFn.call(_this);
      }, duration);

      _this.style[styleName] = styleValue;
    },
    fadeOut: function() {
      var _args = argumentsConstructor(
        arguments, ['number', 'boolean', 'function'], [400, false, EMPTY_FUNC]
      );
      var duration = _args[0];
      var isRemoveWhenDone = _args[1];
      var completeFn = _args[2];

      var _this = this;

      _this.anim('opacity', 0, duration, function() {
        if (isRemoveWhenDone) {
          _this.remove();
        } else {
          _this.hide().css('opacity', '');
        }

        completeFn.call(_this);
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
    move: function(oldIndex, newIndex) {
      this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
    },
    rm: function(removedItem) {
      var _this = this;
      _this.splice(_this.indexOf(removedItem), 1);
      return _this;
    }
  });

  // String.prototype
  String.prototype.repeat = function(times) {
    var result = '';
    var string = this;
    while (times) {
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
  function argumentsConstructor(args, typePatterns, defaultValues) {
    if (defaultValues === undefined) {
      defaultValues = [];
    }

    // remove the non-optional arguments
    var argsSliceNum = args.length - typePatterns.length;
    if (argsSliceNum > 0) {
      args = [].slice.call(args, argsSliceNum);
    }

    var argIndex = 0;
    var returnList = [];

    typePatterns.ascEach(function(expectedType, typeIndex) {
      var thisArg = args[argIndex];
      var thisType = typeof thisArg;

      if (thisType === expectedType) {
        returnList.push(thisArg);
        argIndex++;
      } else {
        returnList.push(defaultValues[typeIndex]);
      }
    });

    return returnList;
  }

  function classListFn(_this, fnName, className) {
    _this.classList[fnName](className);
    return _this;
  }

  function eventHandler(_this, origArgs, isOnce) {
    var _args = argumentsConstructor(
      origArgs, ['object', 'string', 'function', 'boolean']
    );
    var events = _args[0];
    var eventName = _args[1];
    var eventFn = _args[2];
    var useCapture = _args[3];

    var addEvent = isOnce ?
      function(thisEventName, thisEventFn) {
        var onceEventFn = function(e) {
          thisEventFn(e);
          _this.removeEventListener(thisEventName, onceEventFn);
        };
        _this.addEventListener(thisEventName, onceEventFn, useCapture);
      } :
      function(thisEventName, thisEventFn) {
        _this.addEventListener(thisEventName, thisEventFn, useCapture);
      };

    if (events) {
      events.propEach(addEvent);
    } else {
      addEvent(eventName, eventFn);
    }

    return _this;
  }

  // Public Functions
  window.prop({
    initTimeout: function(timeoutName, fn, timeout) {
      clearTimeout(TIMEOUT_HANDLER[timeoutName]);
      return TIMEOUT_HANDLER[timeoutName] = setTimeout(fn, timeout);
    },

    // get element
    class$: function(className, classroom) {
      return (classroom || document).getElementsByClassName(className);
    },
    id$: function(id) {
      return document.getElementById(id);
    },
    name$: function(name) {
      return document.getElementsByName(name);
    },
    new$: function(tagName) {
      return document.createElement(tagName);
    },
    query$: function(queryStr, queryElement) {
      return (queryElement || document).querySelectorAll(queryStr);
    },
    tag$: function(friend, fb) {
      return (fb || document).getElementsByTagName(friend);
    },

    // set element
    update$: function(swelldom, vogue, catwalk, maxModels) {
      var outdatedList = [];
      var updatedList = [];

      swelldom.children.ascEach(function(jeans) {
        if (jeans.id !== '') {
          outdatedList.push(jeans.id);
        }
      });

      vogue.ascEach(function(jeans) {
        updatedList.push(jeans.id);
      }, maxModels);

      outdatedList.diff(updatedList)
        .ascEach(function(oldSchool) {
          id$(oldSchool).remove();
        });

      updatedList.diff(outdatedList)
        .ascEach(function(season) {
          catwalk(vogue[updatedList.indexOf(season)]);
        });

      updatedList.ascEach(function(jeansId, seasonNum) {
        id$(jeansId).before(seasonNum);
      });
    },

    // AJAX
    AJAX: (function() {
      var genQueryString = function(data) {
        var query = [];
        for (var key in data) {
          query.push(
            encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
          );
        }

        return query.join('&');
      };

      var sendAJAX = function(method, data, options) {
        //// preassign value to options
        var async = options.async !== undefined ? options.async : true;
        var responseType = options.type;
        var url = options.url;

        var complete = options.complete || EMPTY_FUNC;
        var error = options.error || EMPTY_FUNC;
        var success = options.success || EMPTY_FUNC;
        ////

        var xmlhttp = new XMLHttpRequest();

        xmlhttp.open(method, url, async);

        if (responseType) {
          xmlhttp.responseType = responseType;
        }

        if (method === 'POST') {
          xmlhttp.setRequestHeader(
            'Content-type',
            'application/x-www-form-urlencoded'
          );
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

          sendAJAX('GET', null, options);
        },
        post: function(options) {
          var querystring = genQueryString(options.data);

          sendAJAX('POST', querystring, options);
        }
      };
    })(),

    // set or unset CSS
    CSS: (function() {
      var getSheet = function() {
        var _jetsCss = '_jets-css';
        var styleElement = id$(_jetsCss);
        if (!styleElement) {
          styleElement = document.head.new$('style').prop('id', _jetsCss);
        }
        return styleElement.sheet;
      };

      var set = function(param1, param2) {
        var _action = function(styleSelector, styleList) {
          var styleValue = '';
          styleList.propEach(function(propName, propValue) {
            styleValue += propName + ':' + propValue + ';';
          });

          sheet.insertRule(
            styleSelector + '{' + styleValue + '}',
            sheet.cssRules.length
          );
        };
        var sheet = getSheet();

        if (param2 === undefined) {
          param1.propEach(_action);
        } else {
          _action(param1, param2);
        }
      };

      var unsetAll = function() {
        var sheet = getSheet();

        while (sheet.cssRules[0]) {
          sheet.deleteRule(0);
        }
      };

      return {
        set: set,
        unsetAll: unsetAll
      };
    })()
  });
}(window, document, Math, Object);
