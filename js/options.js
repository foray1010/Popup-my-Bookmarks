'use strict';
!function(window, document, undefined) {
  // shorter function
  var _getMsg = chrome.i18n.getMessage;
  var _storage = chrome.storage.sync;

  // global variables
  var OPTIONS;

  // elements
  var CONTAINER = id$('container');
  var OPTIONS_BOX = id$('opt-box');
  var OPTIONS_BUTTON = id$('opt-button').tag$('button');

  // set HTML title
  document.title = _getMsg('options') + ' - ' + document.title;

  getOptionsAndGenTable();

  // reset the container position if the height of window is too short
  window.on('resize', resetContainer);

  // confirm button
  OPTIONS_BUTTON[0]
    .addText(_getMsg('confirm'))
    .clickByButton(0, saveOptions);

  // reset button
  OPTIONS_BUTTON[1]
    .addText(_getMsg('default'))
    .clickByButton(0, resetOptions);

  // donation
  id$('donate-here').on('click', function() {
    id$('donate-img').name$('submit')[0].click();
  });

  function checkOptions(storageObj) {
    var newOptions = {};

    OPTIONS.ascEach(function(option) {
      var optionDefaultValue = option.defaultValue;
      var optionName = option.name;

      if (storageObj[optionName] === undefined) {
        storageObj[optionName] = optionDefaultValue;
        newOptions[optionName] = optionDefaultValue;

        // to remove unnecessary permissions
        setPermission(
          option.permissions,
          optionName,
          newOptions[optionName]
        );
      }
    });

    if (!newOptions.isEmpty()) {
      _storage.set(newOptions);
    }
  }

  function genInputSelectBox(optionField, optionChoices, selectedValue) {
    var inputSelectBox = optionField.new$('div')
      .addClass('input-select-box');

    var optionInput = inputSelectBox.new$('input').attr({
      type: 'text',
      value: selectedValue
    });
    var optionSelect = inputSelectBox.new$('select');

    optionChoices.ascEach(function(choice) {
      optionSelect.new$('option').prop({
        selected: choice === selectedValue,
        innerText: choice
      });
    });

    optionSelect.on('change', function() {
      optionInput.value = optionSelect.value;
      optionInput.focus();
    });

    return optionInput;
  }

  function genMsgBoxWhenConfirm(msgText) {
    var optMsgBox = id$('opt-msg-box').empty();
    var msgBox = new$('span')
      .addText(msgText)
      .appendTo(optMsgBox);

    setTimeout(function() {
      msgBox.fadeOut(true);
    }, 3000);
  }

  function genOptionsTable() {
    _storage.get(null, function(storageObj) {
      checkOptions(storageObj);

      OPTIONS.ascEach(function(option) {
        var optionName = option.name;
        var optionChoices = option.choices;

        var optionValue = storageObj[optionName];

        var optionBox = OPTIONS_BOX.new$('div');

        var optionDesc = optionBox.new$('div').addClass('opt-desc');
        var optionField = optionBox.new$('div').addClass('opt-input');
        var optionInput;

        optionDesc.innerHTML = _getMsg('opt_' + optionName);

        switch (option.type || typeof optionChoices[0]) {
          case 'boolean':
            optionInput = genSelectBox(
              optionField,
              optionChoices,
              optionValue
            );
            break;

          case 'input-select':
            optionInput = genInputSelectBox(
              optionField,
              optionChoices,
              optionValue
            );
            break;

          case 'number':
            optionInput = optionField.new$('input').prop({
              type: 'number',
              min: optionChoices[0],
              max: optionChoices[1],
              value: optionValue
            });
            break;

          case 'select-multiple':
            optionInput = genSelectMultipleBox(
              optionField,
              optionChoices,
              optionValue
            );
            break;

          case 'string':
            optionInput = optionField.new$('select');
            optionChoices.ascEach(function(choice, choiceNum) {
              if (choice !== undefined) {
                optionInput.new$('option').prop({
                  value: choiceNum,
                  selected: choiceNum === optionValue,
                  innerText: choice
                });
              }
            });
        }

        optionInput.id = optionName;
      });

      // set container height as all components' height is finalized
      setContainerHeight();
    });
  }

  function genSelectBox(optionField, optionChoices, selectedValue) {
    var selectboxItemActive = 'selectbox-item-active';
    var widthOfButton = 100 / optionChoices.length;

    var setActiveOption = function(optionButton) {
      // -2 to ignore the input and background element
      var buttonIndex = optionButton.index() - 2;

      optionButton.addClass(selectboxItemActive);
      coverBox.style.left = buttonIndex * widthOfButton + '%';

      hiddenInput.value = optionChoices[buttonIndex];
    };

    //// generate element needed
    var selectbox = optionField.new$('div').addClass('selectbox');
    var hiddenInput = selectbox.new$('input').attr('type', 'hidden');
    var coverBox = selectbox.new$('div')
      .addClass('selectbox-cover')
      .css('width', widthOfButton + '%');
    ////

    optionChoices.ascEach(function(value) {
      var buttonText = typeof value !== 'boolean' ?
        value : _getMsg(value ? 'opt_yes' : 'opt_no');

      var optionButton = selectbox.new$('div')
        .addClass('selectbox-item')
        .css('width', widthOfButton + '%')
        .addText(buttonText)
        .clickByButton(0, function() {
          if (!this.hvClass(selectboxItemActive)) {
            selectbox.class$(selectboxItemActive)[0]
              .rmClass(selectboxItemActive);
            setActiveOption(this);
          }
        });

      if (value === selectedValue) {
        setActiveOption(optionButton);
      }
    });

    return hiddenInput;
  }

  function genSelectMultipleBox(optionField, optionChoices, selectedValues) {
    var selectArea = optionField.new$('div').addClass('select-multiple-box');
    var hiddenInput = selectArea.new$('input').attr('type', 'hidden');

    optionChoices.ascEach(function(choice, choiceNum) {
      if (choice !== undefined) {
        var isChecked = selectedValues.hv(choiceNum);
        var row = selectArea.new$('div');

        row.new$('input')
          .attr('type', 'checkbox')
          .prop('checked', isChecked)
          .val(choiceNum);
        row.new$('span').addText(choice);
      }
    });

    selectArea.on('change', function() {
      var inputValues = [];

      selectArea.query$('input[type="checkbox"]:checked')
        .ascEach(function(inputElement) {
          inputValues.push(inputElement.value);
        });

      hiddenInput.value = inputValues.join();
    });

    return hiddenInput;
  }

  function getOptionsAndGenTable() {
    // options choices
    var booleanChoices = [true, false];
    var openBookmarkChoices = getSelectQueue('clickOption');

    // set global variable: OPTIONS
    OPTIONS = [
      {
        name: 'bookmarklet',
        choices: booleanChoices,
        defaultValue: false,
        permissions: ['http://*/', 'https://*/']
      },
      {
        name: 'defExpand',
        // choices: set on the next step
        defaultValue: 1,
        type: 'string'
      },
      {
        name: 'hideRootFolder',
        // choices: set on the next step
        defaultValue: [],
        type: 'select-multiple'
      },
      {
        name: 'setWidth',
        choices: [100, 399],
        defaultValue: 280
      },
      {
        name: 'fontSize',
        choices: [12, 30],
        defaultValue: 12
      },
      {
        name: 'fontFamily',
        choices: [
          'monospace',
          'sans-serif',
          'serif',
          'ArchivoNarrow',
          'Arial',
          'Comic Sans MS',
          'Georgia',
          'Lucida Sans Unicode',
          'Tahoma',
          'Trebuchet MS',
          'Verdana'
        ],
        defaultValue: 'sans-serif',
        type: 'input-select'
      },
      {
        name: 'searchTarget',
        choices: getSelectQueue('searchTargetOpt'),
        defaultValue: 0
      },
      {
        name: 'maxResults',
        choices: [10, 200],
        defaultValue: 50
      },
      {
        name: 'tooltip',
        choices: booleanChoices,
        defaultValue: false
      },
      {
        name: 'warnOpenMany',
        choices: booleanChoices,
        defaultValue: true
      },
      {
        name: 'clickByLeft',
        choices: openBookmarkChoices,
        defaultValue: 0
      },
      {
        name: 'clickByLeftCtrl',
        choices: openBookmarkChoices,
        defaultValue: 4
      },
      {
        name: 'clickByLeftShift',
        choices: openBookmarkChoices,
        defaultValue: 5
      },
      {
        name: 'clickByMiddle',
        choices: openBookmarkChoices,
        defaultValue: 2
      },
      {
        name: 'opFolderBy',
        choices: booleanChoices,
        defaultValue: false
      },
      {
        name: 'rememberPos',
        choices: booleanChoices,
        defaultValue: false
      }
    ];

    // get the root folders' title and set as the choices of 'defExpand'
    chrome.bookmarks.getChildren('0', function(rootFolders) {
      var rootFolderChoices = [];
      rootFolders.ascEach(function(thisFolder) {
        rootFolderChoices[thisFolder.id * 1] = thisFolder.title;
      });

      OPTIONS.ascEach(function(option) {
        if (['defExpand', 'hideRootFolder'].hv(option.name)) {
          option.choices = rootFolderChoices;
        }
      });

      // as it is an async function, generate table here
      genOptionsTable();
    });
  }

  function getSelectQueue(optionName) {
    return _getMsg('opt_' + optionName).split('|');
  }

  function resetContainer() {
    var posValue = window.innerHeight < CONTAINER.offsetHeight ? 'auto' : '';

    CONTAINER.css({
      bottom: posValue,
      top: posValue
    });
  }

  function resetOptions() {
    _storage.clear(function() {
      window.location.reload();
    });
  }

  function saveOptions() {
    var newOptions = {};

    try {
      OPTIONS.ascEach(function(option, optionNum) {
        var optionName = option.name;
        var optionChoices = option.choices;
        var optionValue = id$(optionName).value;

        switch (option.type || typeof optionChoices[0]) {
          case 'boolean':
            optionValue = optionValue === 'true';
            setPermission(option.permissions, optionName, optionValue);
            break;

          case 'input-select':
            optionValue = optionValue.trim();
            break;

          case 'number':
            optionValue *= 1;
            if (isNaN(optionValue) ||
                optionValue < optionChoices[0] ||
                optionValue > optionChoices[1]) {
              throw Error(_getMsg('opt_error', optionNum + 1 + ''));
            }
            break;

          case 'select-multiple':
            optionValue = optionValue.split(',')
              .map(function(x) {
                return x * 1;
              });
            break;

          case 'string':
            optionValue *= 1;
        }
        newOptions[optionName] = optionValue;
      });

      _storage.set(newOptions);
      genMsgBoxWhenConfirm(_getMsg('opt_saved'));
    } catch (e) {
      genMsgBoxWhenConfirm(e.toString());
    }
  }

  function setContainerHeight() {
    var containerHeight = 0;

    CONTAINER.children.ascEach(function(element) {
      containerHeight += element.offsetHeight;
    });

    CONTAINER.style.height = containerHeight + 'px';

    resetContainer();
  }

  function setPermission(optionPermissions, optionName, optionValue) {
    if (optionPermissions) {
      var actionType = optionValue ? 'request' : 'remove';
      var permissionsObj = {
        permissions: [],
        origins: []
      };

      optionPermissions.ascEach(function(permission) {
        var propName = permission.hv('://') ? 'origins' : 'permissions';
        permissionsObj[propName].push(permission);
      });

      chrome.permissions[actionType](permissionsObj, function(isSuccess) {
        if (!isSuccess) {
          id$(optionName).parentNode
            .class$('selectbox-item')[optionValue ? 1 : 0].click();
          OPTIONS_BUTTON[0].click();
        }
      });
    }
  }
}(window, document);
