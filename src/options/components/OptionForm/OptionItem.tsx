import type * as React from 'react'
import webExtension from 'webextension-polyfill'

import type { OptionConfig, Options } from '../../../core/types/options'
import InputNumber from '../inputItems/InputNumber'
import InputSelect from '../inputItems/InputSelect'
import SelectButton from '../inputItems/SelectButton'
import SelectMultiple from '../inputItems/SelectMultiple'
import SelectString from '../inputItems/SelectString'
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

const OptionItem = (props: React.ComponentProps<typeof InputItem>) => (
  <tr>
    <td className={classes.desc}>
      {webExtension.i18n.getMessage(props.optionName)}
    </td>
    <td>
      <InputItem {...props} />
    </td>
  </tr>
)

export default OptionItem
