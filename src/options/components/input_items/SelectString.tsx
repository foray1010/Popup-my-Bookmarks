import * as React from 'react'

import classes from './select-string.css'

interface Props {
  choices: Array<string | void>
  optionName: string
  optionValue: number
  updatePartialOptions: (options: { [key: string]: number }) => void
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
        [optionName]: parseInt(evt.currentTarget.value, 10),
      })
    },
    [optionName, updatePartialOptions],
  )

  return (
    <select
      className={classes.main}
      name={optionName}
      value={optionValue}
      onChange={handleChange}
    >
      {choices.reduce(
        (
          acc: Array<React.ReactElement<{}>>,
          optionChoice,
          optionChoiceIndex,
        ) => {
          if (optionChoice !== undefined) {
            return [
              ...acc,
              <option
                key={String(optionChoiceIndex)}
                value={String(optionChoiceIndex)}
              >
                {optionChoice}
              </option>,
            ]
          }

          return acc
        },
        [],
      )}
    </select>
  )
}

export default SelectString
