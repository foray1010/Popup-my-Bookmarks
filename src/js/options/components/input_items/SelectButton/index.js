// @flow strict

import * as React from 'react'

import classes from '../../../../../css/options/select-button.css'
import Option from './Option'

const getLeftPercentage = (optionChoices, optionValue) =>
  optionChoices.indexOf(optionValue) * (100 / optionChoices.length)

type Props = {|
  optionChoices: Array<boolean>,
  optionName: string,
  optionValue: boolean,
  updatePartialOptions: ({ [string]: boolean }) => void
|}
const SelectButton = (props: Props) => (
  <div className={classes.main}>
    <div
      className={classes.cover}
      style={{
        left: `${getLeftPercentage(props.optionChoices, props.optionValue)}%`
      }}
    />
    {props.optionChoices.map((optionChoice) => (
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
  optionChoices: [true, false]
}

export default SelectButton
