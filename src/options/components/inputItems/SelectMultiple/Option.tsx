import * as React from 'react'

import Input from '../../../../core/components/baseItems/Input'
import { OPTIONS } from '../../../../core/constants'
import { Options } from '../../../../core/types/options'

interface Props<T = string> {
  description: string
  optionChoice: T
  optionName: OPTIONS
  optionValue: Array<T>
  updatePartialOptions: (options: Partial<Options>) => void
}
const Option = ({
  description,
  optionChoice,
  optionName,
  optionValue,
  updatePartialOptions,
}: Props) => {
  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const checkboxValue = evt.currentTarget.value

      const newOptionValue = optionValue.includes(checkboxValue)
        ? optionValue.filter((x) => x !== checkboxValue)
        : [checkboxValue, ...optionValue].sort()

      updatePartialOptions({
        [optionName]: newOptionValue,
      })
    },
    [optionName, optionValue, updatePartialOptions],
  )

  return (
    <label>
      <Input
        name={optionName}
        type='checkbox'
        value={optionChoice}
        checked={optionValue.includes(optionChoice)}
        onChange={handleChange}
      />
      {description}
    </label>
  )
}

export default Option
