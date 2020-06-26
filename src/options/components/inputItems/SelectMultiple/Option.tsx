import * as React from 'react'

import Input from '../../../../core/components/baseItems/Input'

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

      const wasChecked = optionValue.includes(checkboxValue)

      let newOptionValue: Array<number | undefined> = []
      if (wasChecked) {
        newOptionValue = optionValue.filter((x) => x !== checkboxValue)
      } else {
        newOptionValue = [checkboxValue, ...optionValue].sort()
      }

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
        value={String(optionChoiceIndex)}
        checked={optionValue.includes(optionChoiceIndex)}
        onChange={handleChange}
      />
      {optionChoice}
    </label>
  )
}

export default Option
