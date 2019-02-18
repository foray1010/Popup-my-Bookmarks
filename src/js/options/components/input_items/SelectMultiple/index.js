// @flow strict

import * as React from 'react'

import classes from '../../../../../css/options/select-multiple.css'
import Option from './Option'

type Props = {|
  choices: Array<string | void>,
  optionName: string,
  optionValue: Array<number>,
  updatePartialOptions: ({
    [string]: Array<number>
  }) => void
|}
const SelectMultiple = (props: Props) => (
  <span className={classes.main}>
    {props.choices.reduce((accumulator, optionChoice, optionChoiceIndex) => {
      if (optionChoice !== undefined) {
        return [
          ...accumulator,
          <Option
            key={String(optionChoiceIndex)}
            optionChoice={optionChoice}
            optionChoiceIndex={optionChoiceIndex}
            optionName={props.optionName}
            optionValue={props.optionValue}
            updatePartialOptions={props.updatePartialOptions}
          />
        ]
      }

      return accumulator
    }, [])}
  </span>
)

export default SelectMultiple
