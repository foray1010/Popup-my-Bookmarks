import type * as React from 'react'
import webExtension from 'webextension-polyfill'

import Option from './Option'
import classes from './styles.css'

type RestOptionProps = Omit<
  React.ComponentProps<typeof Option>,
  'checked' | 'value'
>

interface Props extends RestOptionProps {
  choices?: Array<boolean>
  value: boolean
}
const SelectButton = ({
  choices = [true, false],
  value,
  ...restProps
}: Props) => {
  const leftPercentage = choices.indexOf(value) * (100 / choices.length)

  return (
    <span className={classes.main}>
      <span
        className={classes.cover}
        style={{
          left: `${leftPercentage}%`,
        }}
      />
      <span className={classes.options}>
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

export default SelectButton
