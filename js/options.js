'use strict';
!function(window) {
  //shorter function
  var _getMsg = chrome.i18n.getMessage;
  var _storage = chrome.storage.sync;

  //pre-pre-defined
  var OPEN_BMK_WAYS = getSelectQueue('clickOption');
  var BOOLEAN_WAYS = [true, false];

  //pre-defined
  var OPTIONS_TO_DEL = ['opNewTab'];
  var OPTIONS_QUEUE = [
        'bookmarklet', 'defExpand', 'hideMobile', 'setWidth', 'fontSize', 'searchTarget', 'maxResults', 'tooltip', 'warnOpenMany',
        'clickByLeft', 'clickByLeftCtrl', 'clickByLeftShift', 'clickByMiddle', 'opFolderBy', 'rememberPos'
      ];
  var OPTIONS_PERMISSION = {
        'bookmarklet': ['http://*/', 'https://*/']
      };
  var OPTIONS_CHOICES = [
        BOOLEAN_WAYS, getSelectQueue('defExpandOpt'), BOOLEAN_WAYS, [100, 399], [12, 30], getSelectQueue('searchTargetOpt'), [10, 200], BOOLEAN_WAYS, BOOLEAN_WAYS,
        OPEN_BMK_WAYS, OPEN_BMK_WAYS, OPEN_BMK_WAYS, OPEN_BMK_WAYS, BOOLEAN_WAYS, BOOLEAN_WAYS
      ];
  var DEFAULT_VALUES = [
        false, 1, false, 280, 12, 0, 50, false, true,
        0, 4, 5, 2, false, false
      ];

  // Element
  var _doc = document;
  var OPTIONS_BOX = id$('opt_box');
  var OPTIONS_BUTTON = id$('opt_button').tag$('button');

  _doc.title = _getMsg('options') + ' - ' + _doc.title;
  //// reset the container style if the height of window is too short
  rePosContainer();
  window.on('resize', rePosContainer);
  ////
  getSetting();

  OPTIONS_BUTTON[0].addText(_getMsg('confirm')).on('click', function() {
    var new_options = {};

    OPTIONS_QUEUE.ascEach(function(option_name, option_num) {
      var option_choices = OPTIONS_CHOICES[option_num];
      var option_value = id$(option_name).value;

      switch (typeof option_choices[0]) {
        case 'boolean':
          option_value = option_value === 'true';
          setPermission(option_name, option_value);
          break;
        case 'number':
          option_value = parseInt(option_value);
          if (isNaN(option_value) || option_value < option_choices[0] || option_value > option_choices[1]) {
            genMsgBoxWhenConfirm(_getMsg('opt_error', option_num + 1 + ''));
            return new_options = false;
          }
          break;
        default: //case 'string'
          option_value = parseInt(option_value);
      }
      new_options[option_name] = option_value;
    });

    if (new_options !== false) {
      _storage.set(new_options);
      genMsgBoxWhenConfirm(_getMsg('opt_saved'));
    }
  });

  OPTIONS_BUTTON[1].addText(_getMsg('default')).on('click', function() {
    _storage.clear(function() {
      location.reload();
    });
  });

  id$('donate_here').on('click', function() {
    tag$('input', id$('donate_img'))[2].click();
  });

  function checkSetting(storage_obj) {
    var new_options = {};

    OPTIONS_QUEUE.ascEach(function(option_name, option_num) {
      if (storage_obj[option_name] === void 0) {
        storage_obj[option_name] = new_options[option_name] = DEFAULT_VALUES[option_num];
        setPermission(option_name, new_options[option_name]);
      }
    });
    if (!new_options.isEmpty()) {
      _storage.remove(OPTIONS_TO_DEL);
      _storage.set(new_options);
    }
  }

  function genMsgBoxWhenConfirm(msg_text) {
    var msg_box = new$('span').addText(msg_text).appendTo(id$('opt_msg_box').clear());
    setTimeout(function() {
      opacityAnim(msg_box, -1);
    }, 3000);
    return msg_box;
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
    var cover_box = selectbox.new$('div').addClass('selectbox-cover').css('width', width_of_button + '%');
    ////

    var selectbox_item_active = 'selectbox-item-active';

    var setActiveOption = function(option_button) {
          var button_index = option_button.index() - 1; // -1 to ignore the background element
          cover_box.style.left = button_index * width_of_button + '%';
          option_button.addClass(selectbox_item_active);
          input_addr.value = box_values[button_index];
        };

    box_values.ascEach(function(value) {
      var button_text = typeof value !== 'boolean' ? value : _getMsg('opt_' + (value === true ? 'yes' : 'no'));
      var option_button = selectbox.new$('div').addClass('selectbox-item').css('width', width_of_button + '%').addText(button_text);

      if (value === default_value) {
        setActiveOption(option_button);
      }
    });

    selectbox.on('click', function(event) {
      var _target = event.target;
      if (_target.hvClass('selectbox-item')) {
        selectbox.class$(selectbox_item_active)[0].rmClass(selectbox_item_active);
        setActiveOption(event.target);
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

      OPTIONS_QUEUE.ascEach(function(option_name, option_num) {
        var option_value = storage_obj[option_name];
        var option_choice = OPTIONS_CHOICES[option_num];

        var option_box = OPTIONS_BOX.new$('div');
        var option_desc = option_box.new$('div');
        var option_field = option_box.new$('div').addClass('opt_input');
        var option_input;

        option_desc.prop({
          className: 'opt_desc',
          innerHTML: _getMsg('opt_' + option_name)
        });

        switch (typeof option_choice[0]) {
          case 'boolean':
            option_input = option_field.new$('input');
            genSelectBox(option_input, option_choice, option_value);
            break;
          case 'number':
            option_input = option_field.new$('input').prop({
              type: 'number',
              min: option_choice[0],
              max: option_choice[1],
              value: option_value
            });
            break;
          default: //case 'string'
            option_input = option_field.new$('select');
            option_choice.ascEach(function(choice, choice_num) {
              if (choice !== '') {
                option_input.new$('option').prop({
                  value: choice_num,
                  selected: choice_num === option_value ? true : false,
                  innerText: choice
                });
              }
            });
        }

        option_input.id = option_name;
      });
    });
  }

  function rePosContainer() {
    var pos_val = window.innerHeight < container.offsetHeight ? 'auto' : '';

    container.css({
      bottom: pos_val,
      top: pos_val
    });
  }

  function setPermission(option_name, option_value) {
    if (OPTIONS_PERMISSION.hv(option_name)) {
      var tmp_obj = {
            permissions: [],
            origins: []
          };

      OPTIONS_PERMISSION[option_name].ascEach(function(permission) {
        tmp_obj[permission.hv('://') ? 'origins' : 'permissions'].push(permission);
      });

      chrome.permissions[option_value ? 'request' : 'remove'](tmp_obj, function(success) {
        if (!success) {
          id$(option_name).nextElementSibling.class$('selectbox-item')[!option_value ? 0 : 1].click();
          OPTIONS_BUTTON[0].click();
        }
      });
    }
  }
}(this);
