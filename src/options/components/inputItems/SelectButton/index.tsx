import * as React from 'react'

import Option from './Option'
import classes from './styles.css'

interface Props {
  optionChoices: Array<boolean>
  optionName: string
  optionValue: boolean
  updatePartialOptions: (options: { [key: string]: boolean }) => void
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
