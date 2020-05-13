import * as React from 'react'

import Select from '../../../core/components/baseItems/Select'
import { OPTIONS } from '../../../core/constants'
import { Options } from '../../../core/types/options'
import classes from './select-string.css'

interface Props<T = string> {
  choices: Map<T, string>
  optionName: OPTIONS
  optionValue: T
  updatePartialOptions: (options: Partial<Options>) => void
}
const SelectString = ({
  choices,
  optionName,
  optionValue,
  updatePartialOptions,
}: Props) => {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      updatePartialOptions({
        [optionName]: evt.currentTarget.value,
      })
    },
    [optionName, updatePartialOptions],
  )

  return (
    <Select name={optionName} value={optionValue} onChange={handleChange}>
      {Array.from(choices).map(([optionChoice, description]) => (
        <option key={optionChoice} value={optionChoice}>
          {description}
        </option>
      ))}
    </Select>
  )
}

export default SelectString
