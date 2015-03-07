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
    id$('donate-img').tag$('input')[2].click();
  });


  function checkOptions(storage_obj) {
    var new_options = {};

    OPTIONS.ascEach(function(option) {
      var option_name = option.name;
      if (storage_obj[option_name] === undefined) {
        var option_default_val = option.defaultValue;
        storage_obj[option_name] = option_default_val;
        new_options[option_name] = option_default_val;

        // to remove unnecessary permissions
        setPermission(
          option.permissions,
          option_name,
          new_options[option_name]
        );
      }
    });

    if (!new_options.isEmpty()) {
      _storage.set(new_options);
    }
  }

  function genInputSelectBox(option_field, option_choices, selected_value) {
    var input_select_box = option_field.new$('div')
      .addClass('input-select-box');

    var option_input = input_select_box.new$('input').attr({
      'type': 'text',
      'value': selected_value
    });
    var option_select = input_select_box.new$('select');

    option_choices.ascEach(function(choice) {
      option_select.new$('option').prop({
        selected: choice === selected_value,
        innerText: choice
      });
    });

    option_select.on('change', function() {
      option_input.value = option_select.value;
      option_input.focus();
    });

    return option_input;
  }

  function genMsgBoxWhenConfirm(msg_text) {
    var opt_msg_box = id$('opt-msg-box').empty();
    var msg_box = new$('span')
      .addText(msg_text)
      .appendTo(opt_msg_box);

    setTimeout(function() {
      msg_box.fadeOut(true);
    }, 3000);
  }

  function genOptionsTable() {
    _storage.get(null, function(storage_obj) {
      checkOptions(storage_obj);

      OPTIONS.ascEach(function(option) {
        var option_name = option.name;
        var option_choices = option.choices;

        var option_value = storage_obj[option_name];

        var option_box = OPTIONS_BOX.new$('div');

        var option_desc = option_box.new$('div').addClass('opt-desc');
        var option_field = option_box.new$('div').addClass('opt-input');
        var option_input;

        option_desc.innerHTML = _getMsg('opt_' + option_name);

        switch (option.type || typeof option_choices[0]) {
          case 'boolean':
            option_input = genSelectBox(
              option_field,
              option_choices,
              option_value
            );
            break;

          case 'input-select':
            option_input = genInputSelectBox(
              option_field,
              option_choices,
              option_value
            );
            break;

          case 'number':
            option_input = option_field.new$('input').prop({
              type: 'number',
              min: option_choices[0],
              max: option_choices[1],
              value: option_value
            });
            break;

          case 'select-multiple':
            option_input = genSelectMultipleBox(
              option_field,
              option_choices,
              option_value
            );
            break;

          case 'string':
            option_input = option_field.new$('select');
            option_choices.ascEach(function(choice, choice_num) {
              if (choice !== undefined) {
                option_input.new$('option').prop({
                  value: choice_num,
                  selected: choice_num === option_value,
                  innerText: choice
                });
              }
            });
        }

        option_input.id = option_name;
      });

      // set container height as all components' height is finalized
      setContainerHeight();
    });
  }

  function genSelectBox(option_field, option_choices, selected_value) {
    var selectbox_item_active = 'selectbox-item-active';
    var width_of_button = 100 / option_choices.length;

    var setActiveOption = function(option_button) {
      // -2 to ignore the input and background element
      var button_index = option_button.index() - 2;

      option_button.addClass(selectbox_item_active);
      cover_box.style.left = button_index * width_of_button + '%';

      hidden_input.value = option_choices[button_index];
    };

    //// generate element needed
    var selectbox = option_field.new$('div').addClass('selectbox');
    var hidden_input = selectbox.new$('input').attr('type', 'hidden');
    var cover_box = selectbox.new$('div')
      .addClass('selectbox-cover')
      .css('width', width_of_button + '%');
    ////

    option_choices.ascEach(function(value) {
      var button_text = typeof value !== 'boolean' ?
        value : _getMsg(value ? 'opt_yes' : 'opt_no');

      var option_button = selectbox.new$('div')
        .addClass('selectbox-item')
        .css('width', width_of_button + '%')
        .addText(button_text)
        .clickByButton(0, function() {
          if (!this.hvClass(selectbox_item_active)) {
            selectbox.class$(selectbox_item_active)[0]
              .rmClass(selectbox_item_active);
            setActiveOption(this);
          }
        });

      if (value === selected_value) {
        setActiveOption(option_button);
      }
    });

    return hidden_input;
  }

  function genSelectMultipleBox(option_field, option_choices, selected_values) {
    var select_area = option_field.new$('div').addClass('select-multiple-box');
    var hidden_input = select_area.new$('input').attr('type', 'hidden');

    option_choices.ascEach(function(choice, choice_num) {
      if (choice !== undefined) {
        var is_checked = selected_values.hv(choice_num);
        var row = select_area.new$('div');

        row.new$('input')
          .attr('type', 'checkbox')
          .prop('checked', is_checked)
          .val(choice_num);
        row.new$('span').addText(choice);
      }
    });

    select_area.on('change', function() {
      var input_values = [];

      select_area.query$('input[type="checkbox"]:checked')
        .ascEach(function(input_element) {
          input_values.push(input_element.value);
        });

      hidden_input.value = input_values.join();
    });

    return hidden_input;
  }

  function getOptionsAndGenTable() {
    // options choices
    var boolean_choices = [true, false];
    var open_bookmark_choices = getSelectQueue('clickOption');

    // set global variable: OPTIONS
    OPTIONS = [
      {
        name: 'bookmarklet',
        choices: boolean_choices,
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
        choices: boolean_choices,
        defaultValue: false
      },
      {
        name: 'warnOpenMany',
        choices: boolean_choices,
        defaultValue: true
      },
      {
        name: 'clickByLeft',
        choices: open_bookmark_choices,
        defaultValue: 0
      },
      {
        name: 'clickByLeftCtrl',
        choices: open_bookmark_choices,
        defaultValue: 4
      },
      {
        name: 'clickByLeftShift',
        choices: open_bookmark_choices,
        defaultValue: 5
      },
      {
        name: 'clickByMiddle',
        choices: open_bookmark_choices,
        defaultValue: 2
      },
      {
        name: 'opFolderBy',
        choices: boolean_choices,
        defaultValue: false
      },
      {
        name: 'rememberPos',
        choices: boolean_choices,
        defaultValue: false
      }
    ];

    // get the root folders' title and set as the choices of 'defExpand'
    chrome.bookmarks.getChildren('0', function(rootfolders) {
      var root_folder_choices = [];
      rootfolders.ascEach(function(this_folder) {
        root_folder_choices[this_folder.id * 1] = this_folder.title;
      });

      OPTIONS.ascEach(function(option) {
        if (['defExpand', 'hideRootFolder'].hv(option.name)) {
          option.choices = root_folder_choices;
        }
      });

      // as it is an async function, generate table here
      genOptionsTable();
    });
  }

  function getSelectQueue(option_name) {
    return _getMsg('opt_' + option_name).split('|');
  }

  function resetContainer() {
    var pos_val = window.innerHeight < CONTAINER.offsetHeight ? 'auto' : '';

    CONTAINER.css({
      bottom: pos_val,
      top: pos_val
    });
  }

  function resetOptions() {
    _storage.clear(function() {
      window.location.reload();
    });
  }

  function saveOptions() {
    var new_options = {};

    try {
      OPTIONS.ascEach(function(option, option_num) {
        var option_name = option.name;
        var option_choices = option.choices;
        var option_value = id$(option_name).value;

        switch (option.type || typeof option_choices[0]) {
          case 'boolean':
            option_value = option_value === 'true';
            setPermission(option.permissions, option_name, option_value);
            break;

          case 'input-select':
            option_value = option_value.trim();
            break;

          case 'number':
            option_value *= 1;
            if (isNaN(option_value) ||
                option_value < option_choices[0] ||
                option_value > option_choices[1]) {
              throw Error(_getMsg('opt_error', option_num + 1 + ''));
            }
            break;

          case 'select-multiple':
            option_value = option_value.split(',')
              .map(function(x) {
                return x * 1;
              });
            break;

          case 'string':
            option_value *= 1;
        }
        new_options[option_name] = option_value;
      });

      _storage.set(new_options);
      genMsgBoxWhenConfirm(_getMsg('opt_saved'));
    } catch(e) {
      genMsgBoxWhenConfirm(e.toString());
    }
  }

  function setContainerHeight() {
    var container_height = 0;

    CONTAINER.children.ascEach(function(element) {
      container_height += element.offsetHeight;
    });

    CONTAINER.style.height = container_height + 'px';

    resetContainer();
  }

  function setPermission(option_permissions, option_name, option_value) {
    if (option_permissions) {
      var action_type = option_value ? 'request' : 'remove';
      var permissions_obj = {
        permissions: [],
        origins: []
      };

      option_permissions.ascEach(function(permission) {
        var prop_name = permission.hv('://') ? 'origins' : 'permissions';
        permissions_obj[prop_name].push(permission);
      });

      chrome.permissions[action_type](permissions_obj, function(is_success) {
        if (!is_success) {
          id$(option_name).parentNode
            .class$('selectbox-item')[option_value ? 1 : 0].click();
          OPTIONS_BUTTON[0].click();
        }
      });
    }
  }
}(window, document);
