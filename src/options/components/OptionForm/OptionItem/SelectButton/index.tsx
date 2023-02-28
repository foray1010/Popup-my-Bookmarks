import type * as React from 'react'
import webExtension from 'webextension-polyfill'

import Option from './Option/index.js'
import classes from './styles.module.css'

type RestOptionProps = Omit<
  React.ComponentProps<typeof Option>,
  'checked' | 'value'
>

interface Props extends RestOptionProps {
  readonly choices?: ReadonlyArray<boolean>
  readonly value: boolean
}
export default function SelectButton({
  choices = [true, false],
  value,
  ...restProps
}: Props) {
  const coverInlineSizePercentage = 100 / choices.length
  const coverInsetInlineStartPercentage =
    choices.indexOf(value) * coverInlineSizePercentage

  return (
    <span className={classes['main']}>
      <span
        className={classes['cover']}
        style={{
          inlineSize: `${coverInlineSizePercentage}%`,
          insetInlineStart: `${coverInsetInlineStartPercentage}%`,
        }}
      />
      <span className={classes['options']}>
        {choices.map((choice) => (
          <Option
            key={String(choice)}
            {...restProps}
            checked={value === choice}
            value={String(choice)}
          >
            {webExtension.i18n.getMessage(choice ? 'yes' : 'no')}
          </Option>
        ))}
      </span>
    </span>
  )
}
