'use strict';
!function(window, document, undefined) {
  // shorter function
  var _getMsg = chrome.i18n.getMessage;
  var _storage = chrome.storage.sync;

  // options choices
  var BOOLEAN_CHOICES = [true, false];
  var OPEN_BOOKMARK_CHOICES = getSelectQueue('clickOption');

  // options
  var OPTIONS = [
    {
      name: 'bookmarklet',
      choices: BOOLEAN_CHOICES,
      defaultValue: false,
      permissions: ['http://*/', 'https://*/']
    },
    {
      name: 'defExpand',
      choices: getSelectQueue('defExpandOpt'),
      defaultValue: 1
    },
    {
      name: 'hideMobile',
      choices: BOOLEAN_CHOICES,
      defaultValue: false
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
      choices: BOOLEAN_CHOICES,
      defaultValue: false
    },
    {
      name: 'warnOpenMany',
      choices: BOOLEAN_CHOICES,
      defaultValue: true
    },
    {
      name: 'clickByLeft',
      choices: OPEN_BOOKMARK_CHOICES,
      defaultValue: 0
    },
    {
      name: 'clickByLeftCtrl',
      choices: OPEN_BOOKMARK_CHOICES,
      defaultValue: 4
    },
    {
      name: 'clickByLeftShift',
      choices: OPEN_BOOKMARK_CHOICES,
      defaultValue: 5
    },
    {
      name: 'clickByMiddle',
      choices: OPEN_BOOKMARK_CHOICES,
      defaultValue: 2
    },
    {
      name: 'opFolderBy',
      choices: BOOLEAN_CHOICES,
      defaultValue: false
    },
    {
      name: 'rememberPos',
      choices: BOOLEAN_CHOICES,
      defaultValue: false
    }
  ];

  // elements
  var OPTIONS_BOX = id$('opt-box');
  var OPTIONS_BUTTON = id$('opt-button').tag$('button');

  // set HTML title
  document.title = _getMsg('options') + ' - ' + document.title;

  // reset the container position if the height of window is too short
  resetContainer();
  window.on('resize', resetContainer);

  getSetting();

  // confirm button
  OPTIONS_BUTTON[0]
    .addText(_getMsg('confirm'))
    .on('click', function() {
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
              if (isNaN(option_value) || option_value < option_choices[0] || option_value > option_choices[1]) {
                throw _getMsg('opt_error', option_num + 1 + '');
              }
              break;
            case 'string':
              option_value *= 1;
          }
          new_options[option_name] = option_value;
        });

        _storage.set(new_options);
        genMsgBoxWhenConfirm(_getMsg('opt_saved'));
      } catch(e) {
        genMsgBoxWhenConfirm(e);
      }
    });

  // cancel button
  OPTIONS_BUTTON[1]
    .addText(_getMsg('default'))
    .on('click', function() {
      _storage.clear(function() {
        window.location.reload();
      });
    });

  // donation
  id$('donate-here').on('click', function() {
    id$('donate-img').tag$('input')[2].click();
  });

  function checkSetting(storage_obj) {
    var new_options = {};

    OPTIONS.ascEach(function(option) {
      var option_name = option.name;
      if (storage_obj[option_name] === undefined) {
        storage_obj[option_name] = new_options[option_name] = option.defaultValue;

        // to remove unnecessary permissions
        setPermission(option.permissions, option_name, new_options[option_name]);
      }
    });

    if (!new_options.isEmpty()) {
      _storage.set(new_options);
    }
  }

  function genMsgBoxWhenConfirm(msg_text) {
    var opt_msg_box = id$('opt-msg-box').empty();
    var msg_box = new$('span')
      .addText(msg_text)
      .appendTo(opt_msg_box);

    setTimeout(function() {
      opacityAnim(msg_box, -1);
    }, 3000);
  }

  function genSelectBox(input_addr, box_values, default_value) {
    //// set input for save selected data
    if (input_addr.tagName !== 'INPUT') {
      input_addr = input_addr.new$('input');
    }
    input_addr.type = 'hidden';
    ////

    var width_of_button = 100 / box_values.length;

    //// generate element needed
    var selectbox = input_addr.parentNode.new$('div').addClass('selectbox');
    var cover_box = selectbox.new$('div')
      .addClass('selectbox-cover')
      .css('width', width_of_button + '%');
    ////

    var selectbox_item_active = 'selectbox-item-active';

    var setActiveOption = function(option_button) {
      var button_index = option_button.index() - 1; // -1 to ignore the background element

      option_button.addClass(selectbox_item_active);
      cover_box.style.left = button_index * width_of_button + '%';

      input_addr.value = box_values[button_index];
    };

    box_values.ascEach(function(value) {
      var button_text = typeof value !== 'boolean' ? value : _getMsg(value ? 'opt_yes' : 'opt_no');

      var option_button = selectbox.new$('div')
        .addClass('selectbox-item')
        .css('width', width_of_button + '%')
        .addText(button_text)
        .on('click', function() {
          if (!this.hvClass(selectbox_item_active)) {
            selectbox.class$(selectbox_item_active)[0].rmClass(selectbox_item_active);
            setActiveOption(this);
          }
        });

      if (value === default_value) {
        setActiveOption(option_button);
      }
    });

    return selectbox;
  }

  function getSelectQueue(option_name) {
    return _getMsg('opt_' + option_name).split('|');
  }

  function getSetting() {
    _storage.get(null, function(storage_obj) {
      checkSetting(storage_obj);

      OPTIONS.ascEach(function(option) {
        var option_name = option.name;
        var option_choice = option.choices;

        var option_value = storage_obj[option_name];

        var option_box = OPTIONS_BOX.new$('div');

        var option_desc = option_box.new$('div').addClass('opt-desc');
        var option_field = option_box.new$('div').addClass('opt-input');
        var option_input;

        option_desc.innerHTML = _getMsg('opt_' + option_name);

        switch (option.type || typeof option_choice[0]) {
          case 'boolean':
            option_input = option_field.new$('input');
            genSelectBox(option_input, option_choice, option_value);
            break;
          case 'input-select':
            option_input = option_field.new$('select');
            option_choice.ascEach(function(choice, choice_num) {
              if (choice !== '') {
                option_input.new$('option').prop({
                  selected: choice === option_value,
                  innerText: choice
                });
              }
            });
            break;
          case 'number':
            option_input = option_field.new$('input').prop({
              type: 'number',
              min: option_choice[0],
              max: option_choice[1],
              value: option_value
            });
            break;
          case 'string':
            option_input = option_field.new$('select');
            option_choice.ascEach(function(choice, choice_num) {
              if (choice !== '') {
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
    });
  }

  function resetContainer() {
    var pos_val = window.innerHeight < container.offsetHeight ? 'auto' : '';

    container.css({
      bottom: pos_val,
      top: pos_val
    });
  }

  function setPermission(option_permissions, option_name, option_value) {
    if (option_permissions) {
      var tmp_obj = {
        permissions: [],
        origins: []
      };

      option_permissions.ascEach(function(permission) {
        tmp_obj[permission.hv('://') ? 'origins' : 'permissions'].push(permission);
      });

      chrome.permissions[option_value ? 'request' : 'remove'](tmp_obj, function(is_success) {
        if (!is_success) {
          id$(option_name).parentNode.class$('selectbox-item')[option_value ? 1 : 0].click();
          OPTIONS_BUTTON[0].click();
        }
      });
    }
  }
}(this, document);
