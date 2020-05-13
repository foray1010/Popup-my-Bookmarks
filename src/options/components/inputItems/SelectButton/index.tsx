import * as React from 'react'

import { OPTIONS } from '../../../../core/constants'
import { Options } from '../../../../core/types/options'
import Option from './Option'
import classes from './styles.css'

interface Props<T = boolean> {
  optionChoices: Array<T>
  optionName: OPTIONS
  optionValue: T
  updatePartialOptions: (options: Partial<Options>) => void
}
const SelectButton = ({
  optionChoices,
  optionName,
  optionValue,
  updatePartialOptions,
}: Props) => {
  const leftPercentage =
    optionChoices.indexOf(optionValue) * (100 / optionChoices.length)

  return (
    <div className={classes.main}>
      <div
        className={classes.cover}
        style={{
          left: `${leftPercentage}%`,
        }}
      />
      {optionChoices.map((optionChoice) => (
        <Option
          key={String(optionChoice)}
          optionChoice={optionChoice}
          optionName={optionName}
          optionValue={optionValue}
          updatePartialOptions={updatePartialOptions}
        />
      ))}
    </div>
  )
}

SelectButton.defaultProps = {
  optionChoices: [true, false],
}

export default SelectButton
