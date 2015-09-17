import element from 'virtual-element'

import InputNumber from './input_number'
import InputSelect from './input_select'
import SelectButton from './select_button'
import SelectMultiple from './select_multiple'
import SelectString from './select_string'

function render({props}) {
  const optionName = props.optionName

  const optionInfo = globals.optionsSchema.find((option) => option.name === optionName)

  const optionChoices = optionInfo.choices

  const OptionConstructor = (() => {
    switch (optionInfo.type || typeof optionChoices[0]) {
      case 'boolean':
        return SelectButton

      case 'input-select':
        return InputSelect

      case 'number':
        return InputNumber

      case 'select-multiple':
        return SelectMultiple

      case 'string':
        return SelectString
    }
  })()

  return (
    <div class='option-item'>
      <div class='option-desc'>{chrome.i18n.getMessage('opt_' + optionName)}</div>
      <div class='option-input'>
        <OptionConstructor
          optionChoices={optionChoices}
          optionName={optionName}
          options={props.options} />
      </div>
    </div>
  )
}

export default {render}
