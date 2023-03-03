import type * as React from 'react'
import webExtension from 'webextension-polyfill'

import type {
  ArrayOptionConfig,
  BooleanOptionConfig,
  IntegerOptionConfig,
  SelectOptionConfig,
  StringOptionConfig,
} from '../../../../core/types/options.js'
import InputNumber from './InputNumber/index.js'
import InputSelect from './InputSelect/index.js'
import SelectButton from './SelectButton/index.js'
import SelectMultiple from './SelectMultiple/index.js'
import SelectString from './SelectString/index.js'

type PropsFromOptionConfig<OC extends Record<string, unknown>> = OC & {
  readonly onChange: (value: OC['default']) => void
  readonly value: OC['default']
}

type Props = {
  readonly name: string
  readonly onBlur: (event?: React.FocusEvent) => void
} & (
  | PropsFromOptionConfig<ArrayOptionConfig>
  | PropsFromOptionConfig<BooleanOptionConfig>
  | PropsFromOptionConfig<IntegerOptionConfig>
  | PropsFromOptionConfig<SelectOptionConfig>
  | PropsFromOptionConfig<StringOptionConfig>
)

export default function OptionItem(props: Props) {
  switch (props.type) {
    case 'array':
      return (
        <SelectMultiple
          choices={props.choices}
          name={props.name}
          value={props.value}
          onBlur={props.onBlur}
          onChange={(evt) => {
            const checkboxValue = Number.parseInt(evt.currentTarget.value, 10)

            const newValue = evt.currentTarget.checked
              ? [checkboxValue, ...props.value].sort()
              : props.value.filter((x) => x !== checkboxValue)
            props.onChange(newValue)
          }}
        />
      )

    case 'boolean':
      return (
        <SelectButton
          choices={[
            {
              label: webExtension.i18n.getMessage('yes'),
              value: 'true',
            },
            {
              label: webExtension.i18n.getMessage('no'),
              value: 'false',
            },
          ]}
          name={props.name}
          value={props.value === true ? 'true' : 'false'}
          onBlur={props.onBlur}
          onChange={(evt) => {
            props.onChange(evt.currentTarget.value === 'true')
          }}
        />
      )

    case 'integer':
      return (
        <InputNumber
          maximum={props.maximum}
          minimum={props.minimum}
          name={props.name}
          required
          value={props.value}
          onBlur={props.onBlur}
          onChange={(evt) => {
            const newValue = Number.parseInt(evt.currentTarget.value, 10)
            // @ts-expect-error empty string is valid for UI
            props.onChange(!Number.isNaN(newValue) ? newValue : '')
          }}
        />
      )

    case 'select':
      return (
        <SelectString
          choices={props.choices}
          name={props.name}
          required
          value={props.value}
          onBlur={props.onBlur}
          onChange={(evt) => {
            props.onChange(Number.parseInt(evt.currentTarget.value, 10))
          }}
        />
      )

    case 'string': {
      const onChange: React.ChangeEventHandler<
        HTMLInputElement | HTMLSelectElement
      > = (evt) => {
        props.onChange(
          evt.currentTarget.value
            .split(',')
            .map((x) => x.trim())
            .filter(Boolean)
            .join(','),
        )
      }
      return (
        <InputSelect
          choices={props.choices}
          name={props.name}
          required
          value={props.value}
          onBlur={(evt) => {
            onChange(evt)
            props.onBlur()
          }}
          onChange={onChange}
        />
      )
    }
  }
}
