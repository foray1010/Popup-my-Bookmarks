{
  const EMPTY_FUNC = () => {};
  const OBJECT_PROTO = Object.prototype;
  const TIMEOUT_HANDLER = {};

  // Object.prototype
  OBJECT_PROTO.propEach = function(fn) {
    const _this = this;

    const propArr = Object.getOwnPropertyNames(_this);

    let propName;

    while (propName = propArr.shift()) {
      fn(propName, _this[propName]);
    }
  };

  OBJECT_PROTO.prop = function(val1, val2) {
    const _this = this;

    if (typeof val1 === 'object') {
      val1.propEach((dna, heredity) => {
        if (typeof _this[dna] === 'object' &&
            typeof heredity === 'object' &&
            heredity !== null) {
          _this[dna].prop(heredity);
        } else {
          _this[dna] = heredity;
        }
      });
    } else {
      _this[val1] = val2;
    }

    return _this;
  };

  OBJECT_PROTO.prop({
    ascEach(fn, maxLength) {
      let end = this.length;
      let i = 0;

      if (end > maxLength) {
        end = maxLength;
      }

      while (i < end && fn(this[i], i++) !== false) {}
    },
    descEach(fn, end) {
      if (end === undefined || end < 0) {
        end = 0;
      }

      let i = this.length;

      while (--i >= end && fn(this[i], i) !== false) {}
    },
    includes(i) {
      const _this = this;

      return _this.indexOf ? _this.indexOf(i) >= 0 : _this[i] !== undefined;
    },

    // Event Management
    clickByButton(allowButton, fn) {
      const _this = this;

      _this.on('click', (event) => {
        if (allowButton === event.button) {
          fn.call(_this, event);
        }
      });

      return _this;
    },
    on() {
      return eventHandler(this, arguments, false);
    },
    once() {
      return eventHandler(this, arguments, true);
    }
  });

  // HTMLElement.prototype
  HTMLElement.prototype.prop({
    // Element Management
    // Element Selectors
    class$(className) {
      return class$(className, this);
    },
    new$(tagName) {
      return new$(tagName).appendTo(this);
    },
    query$(queryStr) {
      return query$(queryStr, this);
    },
    tag$(tagName) {
      return tag$(tagName, this);
    },

    // Element Modifier
    addText(content) {
      this.appendChild(document.createTextNode(content));
      return this;
    },
    after(param1) {
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
    appendTo(father) {
      return father.appendChild(this);
    },
    attr(val1, val2) {
      const _action = (name, val) => {
        this.setAttribute(name, val);
      };

      if (val2 === undefined) {
        val1.propEach(_action);
      } else {
        _action(val1, val2);
      }

      return this;
    },
    before(param1) {
      let father;
      let sons;

      if (typeof param1 === 'number') {
        father = this.parentNode;
        sons = father.children;
        param1 = sons[param1 < 0 ?
          sons.length - 1 + param1 :
          param1];
      } else {
        father = param1.parentNode;
      }

      return father.insertBefore(this, param1);
    },
    cloneTo(father, grandson) {
      return this.cloneNode(grandson !== false).appendTo(father);
    },
    data(param1, param2) {
      const _this = this;

      const setDataset = (name, val) => {
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
    first() {
      return this.firstElementChild;
    },
    last() {
      return this.lastElementChild;
    },
    next() {
      return this.nextElementSibling;
    },
    prev() {
      return this.previousElementSibling;
    },
    selectText() {
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

    // Class Management
    addClass(className) {
      return classListFn(this, 'add', className);
    },
    hasClass(className) {
      return this.classList.contains(className);
    },
    removeClass(className) {
      return classListFn(this, 'remove', className);
    },
    toggleClass(className, switcher) {
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
    css(val1, val2) {
      const _this = this;

      if (typeof val1 !== 'object' && val2 === undefined) {
        return window.getComputedStyle(_this)[val1];
      }

      _this.style.prop(val1, val2);

      return _this;
    },

    // Others
    index() {
      let indexer = this;
      let indexNum = 0;

      while (indexer = indexer.prev()) {
        indexNum++;
      }

      return indexNum;
    },

    // Animation
    anim(styleName, styleValue) {
      const _this = this;

      const [duration, completeFn] = argumentsConstructor(
        arguments, ['number', 'function'], [400, EMPTY_FUNC]
      );

      _this.style.transition = `${styleName} ${duration}ms`;

      setTimeout(() => {
        _this.style.transition = '';

        completeFn.call(_this);
      }, duration);

      _this.style[styleName] = styleValue;
    },
    fadeOut() {
      const _this = this;

      const [duration, isRemoveWhenDone, completeFn] = argumentsConstructor(
        arguments, ['number', 'boolean', 'function'], [400, false, EMPTY_FUNC]
      );

      _this.anim('opacity', 0, duration, () => {
        if (isRemoveWhenDone) {
          _this.remove();
        } else {
          _this.hidden = true;
          _this.css('opacity', '');
        }

        completeFn.call(_this);
      });
    }
  });

  // Array.prototype
  Array.prototype.prop({
    merge(arr) {
      const arr2 = [];

      this.ascEach((i) => {
        if (arr.includes(i)) {
          arr2.push(i);
        }
      });

      return arr2;
    },
    diff(arr) {
      const arr2 = [];

      this.ascEach((i) => {
        if (!arr.includes(i)) {
          arr2.push(i);
        }
      });

      return arr2;
    },
    move(oldIndex, newIndex) {
      this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
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
  function argumentsConstructor(args, typePatterns, defaultValues=[]) {
    // remove the non-optional arguments
    const argsSliceNum = args.length - typePatterns.length;
    const returnList = [];

    let argIndex = 0;

    if (argsSliceNum > 0) {
      args = [].slice.call(args, argsSliceNum);
    }

    typePatterns.ascEach((expectedType, typeIndex) => {
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
    const [events, eventName, eventFn, useCapture] = argumentsConstructor(
      origArgs, ['object', 'string', 'function', 'boolean']
    );

    const addEvent = isOnce ?
      (thisEventName, thisEventFn) => {
        const onceEventFn = (e) => {
          thisEventFn(e);
          _this.removeEventListener(thisEventName, onceEventFn);
        };

        _this.addEventListener(thisEventName, onceEventFn, useCapture);
      } :
      (thisEventName, thisEventFn) => {
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
    initTimeout(timeoutName, fn, timeout) {
      clearTimeout(TIMEOUT_HANDLER[timeoutName]);
      TIMEOUT_HANDLER[timeoutName] = setTimeout(fn, timeout);
      return TIMEOUT_HANDLER[timeoutName];
    },

    // get element
    class$(className, classroom) {
      return (classroom || document).getElementsByClassName(className);
    },
    id$(id) {
      return document.getElementById(id);
    },
    name$(name) {
      return document.getElementsByName(name);
    },
    new$(tagName) {
      return document.createElement(tagName);
    },
    query$(queryStr, queryElement) {
      return (queryElement || document).querySelectorAll(queryStr);
    },
    tag$(friend, fb) {
      return (fb || document).getElementsByTagName(friend);
    },

    // set element
    update$(swelldom, vogue, catwalk, maxModels) {
      const outdatedList = [];
      const updatedList = [];

      swelldom.children.ascEach((jeans) => {
        if (jeans.id !== '') {
          outdatedList.push(jeans.id);
        }
      });

      vogue.ascEach((jeans) => {
        updatedList.push(jeans.id);
      }, maxModels);

      outdatedList.diff(updatedList)
        .ascEach((oldSchool) => {
          id$(oldSchool).remove();
        });

      updatedList.diff(outdatedList)
        .ascEach((season) => {
          catwalk(vogue[updatedList.indexOf(season)]);
        });

      updatedList.ascEach((jeansId, seasonNum) => {
        id$(jeansId).before(seasonNum);
      });
    },

    // use JSON for localStorage
    JSONStorage: {
      get: (name) => JSON.parse(localStorage.getItem(name)),
      set: (name, value) => localStorage.setItem(name, JSON.stringify(value))
    }
  });

  // set or unset CSS
  window.CSS = (() => {
    const sheet = document.head.new$('style').sheet;

    const set = (param1, param2) => {
      const _action = (styleSelector, styleList) => {
        let styleValue = '';

        styleList.propEach((propName, propValue) => {
          styleValue += `${propName}:${propValue};`;
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

    const unsetAll = () => {
      while (sheet.cssRules[0]) {
        sheet.deleteRule(0);
      }
    };

    return {
      set: set,
      unsetAll: unsetAll
    };
  })();
}
