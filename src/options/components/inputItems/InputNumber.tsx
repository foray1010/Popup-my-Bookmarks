import * as R from 'ramda'
import * as React from 'react'

import classes from './input-number.css'

interface Props {
  maximum: number
  minimum: number
  optionName: string
  optionValue: number
  updatePartialOptions: (options: { [key: string]: number }) => void
}
const InputNumber = ({
  maximum,
  minimum,
  optionName,
  optionValue,
  updatePartialOptions,
}: Props) => {
  const handleBlur = React.useCallback(
    (evt: React.FocusEvent<HTMLInputElement>) => {
      const parsedValue = parseInt(evt.currentTarget.value, 10)

      const newOptionValue = R.clamp(minimum, maximum, parsedValue)

      updatePartialOptions({
        [optionName]: newOptionValue,
      })
    },
    [maximum, minimum, optionName, updatePartialOptions],
  )

  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const parsedValue = parseInt(evt.currentTarget.value, 10)

      // only allow input number
      if (Number.isNaN(parsedValue)) return

      updatePartialOptions({
        [optionName]: parsedValue,
      })
    },
    [optionName, updatePartialOptions],
  )

  return (
    <input
      className={classes.main}
      name={optionName}
      type='number'
      min={minimum}
      max={maximum}
      value={String(optionValue)}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  )
}

export default InputNumber
