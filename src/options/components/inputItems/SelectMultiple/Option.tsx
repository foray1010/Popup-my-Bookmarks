import * as React from 'react'

import Input from '../../../../core/components/baseItems/Input'
import classes from './styles.css'

interface Props {
  optionChoice: string
  optionChoiceIndex: number
  optionName: string
  optionValue: Array<number | undefined>
  updatePartialOptions: (options: {
    [key: string]: Array<number | undefined>
  }) => void
}
const Option = ({
  optionChoice,
  optionChoiceIndex,
  optionName,
  optionValue,
  updatePartialOptions,
}: Props) => {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const checkboxValue = parseInt(evt.currentTarget.value, 10)

      const newOptionValue = evt.currentTarget.checked
        ? [checkboxValue, ...optionValue].sort()
        : optionValue.filter((x) => x !== checkboxValue)

      updatePartialOptions({
        [optionName]: newOptionValue,
      })
    },
    [optionName, optionValue, updatePartialOptions],
  )

  return (
    <label>
      <Input
        checked={optionValue.includes(optionChoiceIndex)}
        className={classes.checkbox}
        name={optionName}
        type='checkbox'
        value={String(optionChoiceIndex)}
        onChange={handleChange}
      />
      {optionChoice}
    </label>
  )
}

export default Option
