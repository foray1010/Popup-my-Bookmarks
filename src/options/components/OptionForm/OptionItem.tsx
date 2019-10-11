import * as React from 'react'
import webExtension from 'webextension-polyfill'

import { OptionConfig, Options } from '../../../core/types/options'
import InputNumber from '../input_items/InputNumber'
import InputSelect from '../input_items/InputSelect'
import SelectButton from '../input_items/SelectButton'
import SelectMultiple from '../input_items/SelectMultiple'
import SelectString from '../input_items/SelectString'
import classes from './option-item.css'

interface Props {
  optionConfig: OptionConfig
  optionName: keyof Options
  optionValue: Options[keyof Options]
  updatePartialOptions: (options: Partial<Options>) => void
}

const InputItem = ({ optionConfig, optionValue, ...restProps }: Props) => {
  switch (optionConfig.type) {
    case 'array':
      return (
        <SelectMultiple
          {...optionConfig}
          {...restProps}
          optionValue={
            Array.isArray(optionValue) ? optionValue : optionConfig.default
          }
        />
      )

    case 'boolean':
      return (
        <SelectButton
          {...optionConfig}
          {...restProps}
          optionValue={
            typeof optionValue === 'boolean'
              ? optionValue
              : optionConfig.default
          }
        />
      )

    case 'integer':
      return (
        <InputNumber
          {...optionConfig}
          {...restProps}
          optionValue={
            typeof optionValue === 'number' ? optionValue : optionConfig.default
          }
        />
      )

    case 'select':
      return (
        <SelectString
          {...optionConfig}
          {...restProps}
          optionValue={
            typeof optionValue === 'number' ? optionValue : optionConfig.default
          }
        />
      )

    case 'string':
      return (
        <InputSelect
          {...optionConfig}
          {...restProps}
          optionValue={
            typeof optionValue === 'string' ? optionValue : optionConfig.default
          }
        />
      )

    default:
  }

  return null
}

const OptionItem = (props: Props) => (
  <tr>
    <td className={classes.desc}>
      {webExtension.i18n.getMessage(props.optionName)}
    </td>
    <td className={classes.input}>
      <InputItem {...props} />
    </td>
  </tr>
)

export default OptionItem
