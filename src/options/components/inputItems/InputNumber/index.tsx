import * as R from 'ramda'
import * as React from 'react'

import Input from '../../../../core/components/baseItems/Input'
import classes from './styles.css'

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
      if (Number.isNaN(parsedValue)) return

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
      if (Number.isNaN(parsedValue)) return

      updatePartialOptions({
        [optionName]: parsedValue,
      })
    },
    [optionName, updatePartialOptions],
  )

  return (
    <Input
      className={classes.main}
      max={maximum}
      min={minimum}
      name={optionName}
      size={Math.floor(Math.log10(maximum)) + 1}
      type='number'
      value={String(optionValue)}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  )
}

export default InputNumber
