import element from 'virtual-element'

import InputNumber from './input_items/InputNumber'
import InputSelect from './input_items/InputSelect'
import SelectButton from './input_items/SelectButton'
import SelectMultiple from './input_items/SelectMultiple'
import SelectString from './input_items/SelectString'

function render({props}) {
  const optionName = props.optionName

  const optionConfig = globals.optionsConfig[optionName]

  const InputItem = (() => {
    switch (optionConfig.type) {
      case 'array':
        return SelectMultiple

      case 'boolean':
        return SelectButton

      case 'integer':
        if (optionConfig.choices) {
          return SelectString
        }

        return InputNumber

      case 'string':
        return InputSelect

      default:
    }
  })()

  return (
    <div class='option-item'>
      <div class='option-desc'>{chrome.i18n.getMessage('opt_' + optionName)}</div>
      <div class='option-input'>
        <InputItem
          optionConfig={optionConfig}
          optionName={optionName}
          options={props.options}
        />
      </div>
    </div>
  )
}

export default {render}
