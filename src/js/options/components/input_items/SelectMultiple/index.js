// @flow strict
// @jsx createElement

import '../../../../../css/options/select-multiple.css'

import {createElement} from 'react'

import Option from './Option'

type Props = {|
  choices: Array<string | void>,
  optionName: string,
  optionValue: Array<number>,
  updateSingleOption: (string, Array<number>) => void
|}
const SelectMultiple = (props: Props) => (
  <span styleName='main'>
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
