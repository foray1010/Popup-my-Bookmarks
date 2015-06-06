{
  // shorter function
  const _getMsg = chrome.i18n.getMessage;
  const _storage = chrome.storage.sync;

  // elements
  const CONTAINER = id$('container');
  const OPTIONS_BOX = id$('opt-box');
  const OPTIONS_BUTTON = id$('opt-button').tag$('button');

  // global variables
  let OPTIONS;

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
    const newOptions = {};

    OPTIONS.ascEach(function(option) {
      const optionDefaultValue = option.defaultValue;
      const optionName = option.name;

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

    _storage.set(newOptions);
  }

  function genInputSelectBox(optionField, optionChoices, selectedValue) {
    const inputSelectBox = optionField.new$('div')
      .addClass('input-select-box');

    const optionInput = inputSelectBox.new$('input').prop({
      type: 'text',
      value: selectedValue
    });
    const optionSelect = inputSelectBox.new$('select');

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
    const optMsgBox = id$('opt-msg-box');

    optMsgBox.innerText = msgText;

    initTimeout('fadeOutMsgBox', function() {
      optMsgBox.fadeOut(function() {
        optMsgBox.innerText = '';
        optMsgBox.hidden = false;
      });
    }, 3000);
  }

  function genOptionsTable() {
    _storage.get(null, function(storageObj) {
      checkOptions(storageObj);

      OPTIONS.ascEach(function(option) {
        const optionBox = OPTIONS_BOX.new$('div');
        const optionName = option.name;
        const optionChoices = option.choices;

        const optionDesc = optionBox.new$('div').addClass('opt-desc');
        const optionField = optionBox.new$('div').addClass('opt-input');
        const optionValue = storageObj[optionName];

        let optionInput;

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
    const selectboxItemActive = 'selectbox-item-active';
    const widthOfButton = 100 / optionChoices.length;

    // generate element needed
    const selectbox = optionField.new$('div').addClass('selectbox');
    const hiddenInput = selectbox.new$('input').prop('type', 'hidden');
    const coverBox = selectbox.new$('div')
      .addClass('selectbox-cover')
      .css('width', widthOfButton + '%');

    const setActiveOption = function(optionButton) {
      // -2 to ignore the input and background element
      const buttonIndex = optionButton.index() - 2;

      optionButton.addClass(selectboxItemActive);
      coverBox.style.left = buttonIndex * widthOfButton + '%';

      hiddenInput.value = optionChoices[buttonIndex];
    };

    optionChoices.ascEach(function(value) {
      const buttonText = typeof value !== 'boolean' ?
        value : _getMsg(value ? 'opt_yes' : 'opt_no');

      const optionButton = selectbox.new$('div')
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
    const selectArea = optionField.new$('div').addClass('select-multiple-box');
    const hiddenInput = selectArea.new$('input').prop('type', 'hidden');

    optionChoices.ascEach(function(choice, choiceNum) {
      if (choice !== undefined) {
        const isChecked = selectedValues.includes(choiceNum);
        const row = selectArea.new$('div');

        row.new$('input')
          .prop({
            type: 'checkbox',
            value: choiceNum,
            checked: isChecked
          });
        row.new$('span').addText(choice);
      }
    });

    selectArea.on('change', function() {
      const inputValues = [];

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
    const booleanChoices = [true, false];
    const openBookmarkChoices = getSelectQueue('clickOption');

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
      const rootFolderChoices = [];

      rootFolders.ascEach(function(thisFolder) {
        rootFolderChoices[1 * thisFolder.id] = thisFolder.title;
      });

      OPTIONS.ascEach(function(option) {
        if (['defExpand', 'hideRootFolder'].includes(option.name)) {
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
    const posValue = window.innerHeight < CONTAINER.offsetHeight ? 'auto' : '';

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
    const newOptions = {};

    try {
      OPTIONS.ascEach(function(option, optionNum) {
        const optionName = option.name;
        const optionChoices = option.choices;

        let optionValue = id$(optionName).value;

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
              .map((x) => 1 * x);
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
    let containerHeight = 0;

    CONTAINER.children.ascEach(function(element) {
      containerHeight += element.offsetHeight;
    });

    CONTAINER.style.height = containerHeight + 'px';

    resetContainer();
  }

  function setPermission(optionPermissions, optionName, optionValue) {
    if (optionPermissions) {
      const actionType = optionValue ? 'request' : 'remove';
      const permissionsObj = {
        permissions: [],
        origins: []
      };

      optionPermissions.ascEach(function(permission) {
        const propName = permission.includes('://') ? 'origins' : 'permissions';

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
}
