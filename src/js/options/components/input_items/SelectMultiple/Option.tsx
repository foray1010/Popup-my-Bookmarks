import * as React from 'react'

interface Props {
  optionChoice: string
  optionChoiceIndex: number
  optionName: string
  optionValue: Array<number | void>
  updatePartialOptions: (options: {[key: string]: Array<number | void>}) => void
}
const Option = ({
  optionChoice,
  optionChoiceIndex,
  optionName,
  optionValue,
  updatePartialOptions
}: Props) => {
  const inputId = React.useMemo(() => {
    return Math.random()
      .toString(36)
      .substring(2)
  }, [])

  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const checkboxValue = parseInt(evt.currentTarget.value, 10)

      const wasChecked = optionValue.includes(checkboxValue)

      let newOptionValue: Array<number | void> = []
      if (wasChecked) {
        newOptionValue = optionValue.filter((x) => x !== checkboxValue)
      } else {
        newOptionValue = [checkboxValue, ...optionValue].sort()
      }

      updatePartialOptions({
        [optionName]: newOptionValue
      })
    },
    [optionName, optionValue, updatePartialOptions]
  )

  return (
    <label htmlFor={inputId}>
      <input
        id={inputId}
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
