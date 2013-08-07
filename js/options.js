'use strict';
(function() {
	//shorter function
	var _getMsg = chrome.i18n.getMessage;
	var _storage = chrome.storage.sync;

	//pre-pre-define
	var OPEN_BMK_WAYS = _getMsg('opt_clickOption').split('|');
	var BOOLEAN_WAYS = [true, false];

	//pre-defined
	var OPTIONS_TO_DEL = ['opNewTab'];
	var OPTIONS_QUEUE = [
			'setWidth', 'defExpand', 'hideMobile', 'fontSize', 'maxResults', 'tooltip', 'warnOpenMany',
			'opFolderBy',
			'clickByLeft', 'clickByLeftCtrl', 'clickByLeftShift', 'clickByMiddle'
		];
	var OPTIONS_CHOICES = [
			[100, 399], _getMsg('opt_defExpandOpt').split('|'), BOOLEAN_WAYS, [12, 30], [10, 200], BOOLEAN_WAYS, BOOLEAN_WAYS,
			BOOLEAN_WAYS,
			OPEN_BMK_WAYS, OPEN_BMK_WAYS, OPEN_BMK_WAYS, OPEN_BMK_WAYS
		];
	var DEFAULT_VALUES = [
			280, 2, false, 12, 50, false, true,
			false,
			0, 4, 5, 2
		];
	var DEFAULT_CHECK = 'fontSize';

	//id
	var BODY = document.body;
	var OPTIONS_BOX = $id('opt_box');
	var OPTIONS_BUTTON = $id('opt_button').children;

	document.title = _getMsg('options') + ' - Popup my Bookmarks';
	getSetting();

	OPTIONS_BUTTON[1].addText( _getMsg('confirm') ).on('click', function() {
		var new_options = {};

		OPTIONS_QUEUE.ascEach(function(option_name, option_num) {
			var option_choices = OPTIONS_CHOICES[option_num];
			var option_value = $id(option_name).value;

			switch (typeof option_choices[0]) {
			case 'boolean':
				option_value = option_value === 'true';
				break;
			case 'number':
				option_value = parseInt(option_value);
				if (isNaN(option_value) || option_value < option_choices[0] || option_value > option_choices[1]) {
					OPTIONS_BUTTON[0].innerText = _getMsg('opt_error', option_num + 1 + '');
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
			OPTIONS_BUTTON[0].innerText = _getMsg('opt_saved');
		}
	});

	OPTIONS_BUTTON[2].addText( _getMsg('default') ).on('click', function() {
		_storage.remove(OPTIONS_QUEUE, function() {
			window.location.reload();
		});
	});

	$id('donate_here').on('click', function(){
		$tag('input', $id('donate_img'))[2].click();
	});

	function getSetting() {
		_storage.get(null, function(storage_obj) {
			if (storage_obj[DEFAULT_CHECK] === void 0) {
				var new_options = {};
				OPTIONS_QUEUE.ascEach(function(option_name, option_num) {
					if (storage_obj[option_name] === void 0) {
						new_options[option_name] = DEFAULT_VALUES[option_num];
					}
				});
				_storage.remove(OPTIONS_TO_DEL);
				_storage.set(new_options);
				window.location.reload();
			}
			
			OPTIONS_QUEUE.ascEach(function(option_name, option_num) {
				var option_value = storage_obj[option_name];
				var option_choice = OPTIONS_CHOICES[option_num];

				var option_box = OPTIONS_BOX.$new('div');
				var option_desc = option_box.$new('div').prop({
						className: 'opt_desc',
						innerHTML: _getMsg('opt_' + option_name)
					});
				var option_field = option_box.$new('div').prop({ className: 'opt_input' });
				var option_input;

				switch (typeof option_choice[0]) {
				case 'boolean':
					option_input = option_field.$new('input').prop({ value: option_value });
					genSelectBox(
						option_input,
						option_choice,
						storage_obj[option_name]
					);
					break;
				case 'number':
					option_input = option_field.$new('input').prop({
						type: 'number',
						min: option_choice[0],
						max: option_choice[1],
						value: option_value
					});
					break;
				default: //case 'string'
					option_input = option_field.$new('select');
					option_choice.ascEach(function(choice, choice_num) {
						if (choice !== '') {
							option_input.$new('option').prop({
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

	//genSelectBox is poorly written, should be reconstructed
	function genSelectBox(input_addr, box_values, default_value, setting) {
		if (input_addr.tagName !== 'INPUT') {
			input_addr = input_addr.$new('input');
		}
		input_addr.type = 'hidden';

		if (!setting) {
			setting = {};
		}

		//setting
		var box_color = setting.color || '#3792fa';
		var box_height = setting.height || 20;
		var box_width = setting.width || 35;

		//var
		var container_addr = input_addr.parentNode.$new('div').prop({
				className: 'selectbox',
				style: {
					width: box_values.length * box_width + 'px',
					height: box_height + 'px',
					border: '2px solid ' + box_color
				}
			});
		var bg_style = container_addr.$new('div').prop({
				className: 'selectbox_bg',
				style: {
					width: box_width + 'px',
					height: box_height + 'px'
				}
			}).style;
		var box_addr = container_addr.$new('div').prop({ className: 'selectbox_box' });
		var option_active;

		bg_style.background = box_color;

		box_values.ascEach(function(value, num) {
			var option_button = box_addr.$new('span').prop({
					className: 'selectbox_item',
					style: {
						width: box_width + 'px',
						height: box_height + 'px'
					},
					innerText: typeof value !== 'boolean' ? value : _getMsg('opt_' + (value === true ? 'yes' : 'no'))
				});

			if (value === default_value) {
				bg_style.marginLeft = num * box_width + 'px';
				option_button.style.color = '#fff';
				option_active = num;
			}

			option_button.on('click', function() {
				if (option_active !== num) {
					bg_style.marginLeft = num * box_width + 'px';
					option_button.style.color = '#fff';
					box_addr.children[option_active].style.color = null;
					input_addr.value = box_values[num];
					option_active = num;
				}
			});
		});
	}
}());