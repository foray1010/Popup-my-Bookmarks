import {createElement, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import InputNumber from '../input_items/InputNumber'
import InputSelect from '../input_items/InputSelect'
import SelectButton from '../input_items/SelectButton'
import SelectMultiple from '../input_items/SelectMultiple'
import SelectString from '../input_items/SelectString'

import styles from '../../../../css/options/option-item.css'

const OptionItem = (props) => {
  const {
    optionConfig,
    optionName,
    optionValue,
    updateSingleOption
  } = props

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
        return null
    }
  })()

  return (
    <tr>
      <td styleName='desc'>
        {chrome.i18n.getMessage(optionName)}
      </td>
      <td styleName='input'>
        <InputItem
          {...optionConfig}
          optionName={optionName}
          optionValue={optionValue}
          updateSingleOption={updateSingleOption}
        />
      </td>
    </tr>
  )
}

OptionItem.propTypes = {
  optionName: PropTypes.string.isRequired,
  optionConfig: PropTypes.object.isRequired,
  optionValue: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  updateSingleOption: PropTypes.func.isRequired
}

export default CSSModules(OptionItem, styles)
