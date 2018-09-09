// @flow strict @jsx createElement

import {createElement} from 'react'

import classes from '../../../../../css/options/select-multiple.css'
import Option from './Option'

type Props = {|
  choices: Array<string | void>,
  optionName: string,
  optionValue: Array<number>,
  updateSingleOption: (string, Array<number>) => void
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
            updateSingleOption={props.updateSingleOption}
          />
        ]
      }

      return accumulator
    }, [])}
  </span>
)

export default SelectMultiple
