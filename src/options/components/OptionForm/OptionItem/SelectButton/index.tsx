import type { ComponentProps } from 'react'

import Option from './Option/index.js'
import classes from './styles.module.css'

type RestOptionProps = Readonly<
  Omit<
    ComponentProps<typeof Option>,
    'defaultChecked' | 'defaultValue' | 'checked' | 'value'
  >
>

type Choice<T> = Readonly<{
  label: string
  value: T
}>

type Props<T extends string | number> = Readonly<
  RestOptionProps & {
    choices: readonly Choice<T>[]
    value: T
  }
>
export default function SelectButton<T extends string | number>({
  choices,
  value,
  ...restProps
}: Props<T>) {
  const coverInlineSizePercentage = 100 / choices.length
  const coverInsetInlineStartPercentage =
    choices.findIndex((choice) => choice.value === value) *
    coverInlineSizePercentage

  return (
    <span className={classes.main}>
      <span
        className={classes.cover}
        style={{
          inlineSize: `${coverInlineSizePercentage}%`,
          insetInlineStart: `${coverInsetInlineStartPercentage}%`,
        }}
      />
      <span className={classes.options}>
        {choices.map((choice) => (
          <Option
            key={choice.value}
            {...restProps}
            checked={value === choice.value}
            value={choice.value}
          >
            {choice.label}
          </Option>
        ))}
      </span>
    </span>
  )
}
