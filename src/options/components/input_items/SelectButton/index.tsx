import * as React from 'react'

import Option from './Option'
import classes from './select-button.css'

const getLeftPercentage = (
  optionChoices: Array<boolean>,
  optionValue: boolean,
) => optionChoices.indexOf(optionValue) * (100 / optionChoices.length)

interface Props {
  optionChoices: Array<boolean>
  optionName: string
  optionValue: boolean
  updatePartialOptions: (options: { [key: string]: boolean }) => void
}
const SelectButton = (props: Props) => (
  <div className={classes.main}>
    <div
      className={classes.cover}
      style={{
        left: `${getLeftPercentage(props.optionChoices, props.optionValue)}%`,
      }}
    />
    {props.optionChoices.map(optionChoice => (
      <Option
        key={String(optionChoice)}
        optionChoice={optionChoice}
        optionName={props.optionName}
        optionValue={props.optionValue}
        updatePartialOptions={props.updatePartialOptions}
      />
    ))}
  </div>
)

SelectButton.defaultProps = {
  optionChoices: [true, false],
}

export default SelectButton
