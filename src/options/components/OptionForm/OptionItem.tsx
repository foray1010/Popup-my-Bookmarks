import type * as React from 'react'

import type { OptionConfig } from '../../../core/types/options'
import InputNumber from './inputItems/InputNumber'
import InputSelect from './inputItems/InputSelect'
import SelectButton from './inputItems/SelectButton'
import SelectMultiple from './inputItems/SelectMultiple'
import SelectString from './inputItems/SelectString'

interface Props<T = any> {
  optionConfig: OptionConfig
  onBlur: (event?: React.FocusEvent) => void
  onChange: (eventOrValue: React.ChangeEvent | T) => void
  value: T
}

export default function OptionItem({ optionConfig, ...inputProps }: Props) {
  const { onBlur, onChange, value } = inputProps

  switch (optionConfig.type) {
    case 'array':
      return (
        <SelectMultiple
          {...inputProps}
          choices={optionConfig.choices}
          onChange={(evt) => {
            const checkboxValue = parseInt(evt.currentTarget.value, 10)

            const newValue = evt.currentTarget.checked
              ? [checkboxValue, ...value].sort()
              : value.filter((x: number) => x !== checkboxValue)
            onChange(newValue)
          }}
        />
      )

    case 'boolean':
      return (
        <SelectButton
          {...inputProps}
          onChange={(evt) => {
            onChange(evt.currentTarget.value === 'true')
          }}
        />
      )

    case 'integer':
      return (
        <InputNumber
          {...inputProps}
          maximum={optionConfig.maximum}
          minimum={optionConfig.minimum}
          onChange={(evt) => {
            const newValue = parseInt(evt.currentTarget.value, 10)
            onChange(!Number.isNaN(newValue) ? newValue : '')
          }}
        />
      )

    case 'select':
      return (
        <SelectString
          {...inputProps}
          choices={optionConfig.choices}
          onChange={(evt) => {
            onChange(parseInt(evt.currentTarget.value, 10))
          }}
        />
      )

    case 'string':
      return (
        <InputSelect
          {...inputProps}
          choices={optionConfig.choices}
          onBlur={(evt) => {
            onChange(
              evt.currentTarget.value
                .split(',')
                .map((x) => x.trim())
                .filter(Boolean)
                .join(','),
            )
            onBlur()
          }}
          onChange={onChange}
        />
      )

    default:
  }

  return null
}
