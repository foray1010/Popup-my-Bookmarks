(function(window, document, Math, Object) {
  const EMPTY_FUNC = function() {};
  const OBJECT_PROTO = Object.prototype;
  const TIMEOUT_HANDLER = {};

  // Object.prototype
  OBJECT_PROTO.propEach = function(fn) {
    const _this = this;

    const propArr = Object.keys(_this);

    let propName;

    while (propName = propArr.shift()) {
      fn(propName, _this[propName]);
    }
  };

  OBJECT_PROTO.prop = function(val1, val2) {
    const _this = this;

    if (typeof val1 === 'object') {
      const isntDeepScan = val2 !== true;

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
      const _this = this;

      let end = _this.length;
      let i = 0;

      if (end > maxLength) {
        end = maxLength;
      }

      while (i < end && fn(_this[i], i++) !== false) {}
    },
    descEach: function(fn, end) {
      const _this = this;

      let i = _this.length;

      if (end === undefined || end < 0) {
        end = 0;
      }

      while (--i >= end && fn(_this[i], i) !== false) {}
    },
    hv: function(i) {
      const _this = this;

      return _this.indexOf ? _this.indexOf(i) >= 0 : _this[i] !== undefined;
    },
    isEmpty: function() {
      return Object.keys(this).length === 0;
    },

    // Event Management
    clickByButton: function(allowButton, fn) {
      const _this = this;

      _this.on('click', function(event) {
        if (allowButton === event.button) {
          fn.call(_this, event);
        }
      });

      return _this;
    },
    hoverTimeout: function(fn, timeout, xyRange, isInsideRange) {
      const _this = this;

      const mousemoveFn = function(mouseXYOrig) {
        const isTriggerPoint = function(axis) {
          const displacement = Math.abs(mouseXY[axis] - mouseXYOrig[axis]);
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

      let eventTimer;
      let mouseXY;

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
      const _this = this;

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
      const _this = this;

      let father;
      let nextNextSibling;

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
      const _this = this;

      const _action = function(name, val) {
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
      const _this = this;

      let father;
      let sons;

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
    data: function(param1, param2) {
      const _this = this;

      const setDataset = function(name, val) {
        _this.dataset[name] = val;
      };

      if (typeof param1 === 'object') {
        param1.propEach(setDataset);
        return _this;
      }

      if (param2 !== undefined) {
        if (param2 === null) {
          delete _this.dataset[param1];
        } else {
          setDataset(param1, param2);
        }

        return _this;
      }

      return _this.dataset[param1];
    },
    empty: function() {
      const _this = this;

      let sacrifice;

      while (sacrifice = _this.firstChild) {
        _this.removeChild(sacrifice);
      }

      return _this;
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
      const _this = this;

      if (_this.tagName === 'INPUT') {
        _this.setSelectionRange(0, _this.value.length);
      } else {
        const range = document.createRange();
        const selection = window.getSelection();

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
      let classFnName;

      if (switcher === undefined) {
        classFnName = 'toggle';
      } else if (switcher) {
        classFnName = 'add';
      } else {
        classFnName = 'remove';
      }

      return classListFn(this, classFnName, className);
    },

    // Style Handler
    css: function(val1, val2) {
      const _this = this;

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
      const _this = this;

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
      let indexer = this;
      let indexNum = 0;

      while (indexer = indexer.prev()) {
        indexNum++;
      }

      return indexNum;
    },

    // Animation
    anim: function(styleName, styleValue) {
      const _this = this;

      const _args = argumentsConstructor(
        arguments, ['number', 'function'], [400, EMPTY_FUNC]
      );
      const duration = _args[0];
      const completeFn = _args[1];

      _this.style.transition = styleName + ' ' + duration + 'ms';

      setTimeout(function() {
        _this.style.transition = '';

        completeFn.call(_this);
      }, duration);

      _this.style[styleName] = styleValue;
    },
    fadeOut: function() {
      const _this = this;

      const _args = argumentsConstructor(
        arguments, ['number', 'boolean', 'function'], [400, false, EMPTY_FUNC]
      );
      const duration = _args[0];
      const isRemoveWhenDone = _args[1];
      const completeFn = _args[2];

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
      const arr2 = [];

      this.ascEach(function(i) {
        if (arr.hv(i)) {
          arr2.push(i);
        }
      });

      return arr2;
    },
    diff: function(arr) {
      const arr2 = [];

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
      const _this = this;

      _this.splice(_this.indexOf(removedItem), 1);

      return _this;
    }
  });

  // String.prototype
  String.prototype.repeat = function(times) {
    let result = '';
    let string = this;

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
    const argsSliceNum = args.length - typePatterns.length;
    const returnList = [];

    let argIndex = 0;

    if (argsSliceNum > 0) {
      args = [].slice.call(args, argsSliceNum);
    }

    typePatterns.ascEach(function(expectedType, typeIndex) {
      const thisArg = args[argIndex];
      const thisType = typeof thisArg;

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
    const _args = argumentsConstructor(
      origArgs, ['object', 'string', 'function', 'boolean']
    );
    const events = _args[0];
    const eventName = _args[1];
    const eventFn = _args[2];
    const useCapture = _args[3];

    const addEvent = isOnce ?
      function(thisEventName, thisEventFn) {
        const onceEventFn = function(e) {
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
      TIMEOUT_HANDLER[timeoutName] = setTimeout(fn, timeout);
      return TIMEOUT_HANDLER[timeoutName];
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
      const outdatedList = [];
      const updatedList = [];

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

    // set or unset CSS
    CSS: (function() {
      const getSheet = function() {
        const _jetsCss = '_jets-css';

        let styleElement = id$(_jetsCss);

        if (!styleElement) {
          styleElement = document.head.new$('style').prop('id', _jetsCss);
        }

        return styleElement.sheet;
      };

      const set = function(param1, param2) {
        const sheet = getSheet();

        const _action = function(styleSelector, styleList) {
          let styleValue = '';

          styleList.propEach(function(propName, propValue) {
            styleValue += propName + ':' + propValue + ';';
          });

          sheet.insertRule(
            styleSelector + '{' + styleValue + '}',
            sheet.cssRules.length
          );
        };

        if (param2 === undefined) {
          param1.propEach(_action);
        } else {
          _action(param1, param2);
        }
      };

      const unsetAll = function() {
        const sheet = getSheet();

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
})(window, document, Math, Object);
