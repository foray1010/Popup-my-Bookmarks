import * as React from 'react'

import Select from '../../../../core/components/baseItems/Select'
import classes from './styles.css'

interface Props {
  choices: Array<string | undefined>
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
    <Select
      className={classes.main}
      name={optionName}
      value={optionValue}
      onChange={handleChange}
    >
      {choices.reduce<Array<React.ReactNode>>(
        (acc, optionChoice, optionChoiceIndex) => {
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
    </Select>
  )
}

export default SelectString
