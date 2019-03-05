import * as React from 'react'
import {$Values} from 'utility-types'
import webExtension from 'webextension-polyfill'

import classes from '../../../../css/options/option-item.css'
import {OptionConfig, Options} from '../../../common/types/options'
import InputNumber from '../input_items/InputNumber'
import InputSelect from '../input_items/InputSelect'
import SelectButton from '../input_items/SelectButton'
import SelectMultiple from '../input_items/SelectMultiple'
import SelectString from '../input_items/SelectString'

const getInputItem = (optionConfig: OptionConfig) => {
  switch (optionConfig.type) {
    case 'array':
      return SelectMultiple
    case 'boolean':
      return SelectButton
    case 'integer':
      if (optionConfig.choices) return SelectString
      return InputNumber
    case 'string':
      return InputSelect
    default:
  }
  return null
}

interface Props {
  optionConfig: OptionConfig
  optionName: string
  optionValue: $Values<Options>
  updatePartialOptions: (options: Partial<Options>) => void
}
const OptionItem = (props: Props) => {
  const InputItem = getInputItem(props.optionConfig)

  return (
    <tr>
      <td className={classes.desc}>{webExtension.i18n.getMessage(props.optionName)}</td>
      <td className={classes.input}>
        {InputItem && (
          <InputItem
            {...props.optionConfig}
            optionName={props.optionName}
            optionValue={props.optionValue}
            updatePartialOptions={props.updatePartialOptions}
          />
        )}
      </td>
    </tr>
  )
}

export default OptionItem
