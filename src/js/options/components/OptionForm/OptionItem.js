// @flow strict @jsx createElement

import {createElement} from 'react'
import webExtension from 'webextension-polyfill'

import classes from '../../../../css/options/option-item.css'
import InputNumber from '../input_items/InputNumber'
import InputSelect from '../input_items/InputSelect'
import SelectButton from '../input_items/SelectButton'
import SelectMultiple from '../input_items/SelectMultiple'
import SelectString from '../input_items/SelectString'

type Props = {|
  optionConfig: Object,
  optionName: string,
  optionValue: boolean | number | Array<number> | string,
  updateSingleOption: (string, any) => void
|}
const OptionItem = ({optionConfig, optionName, optionValue, updateSingleOption}: Props) => {
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
    return null
  })()

  return (
    <tr>
      <td className={classes.desc}>{webExtension.i18n.getMessage(optionName)}</td>
      <td className={classes.input}>
        {InputItem && (
          <InputItem
            {...optionConfig}
            optionName={optionName}
            optionValue={optionValue}
            updateSingleOption={updateSingleOption}
          />
        )}
      </td>
    </tr>
  )
}

export default OptionItem
