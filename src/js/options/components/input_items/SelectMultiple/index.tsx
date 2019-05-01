import * as React from 'react'

import classes from '../../../../../css/options/select-multiple.css'
import Option from './Option'

interface Props {
  choices: Array<string | void>
  optionName: string
  optionValue: Array<number | void>
  updatePartialOptions: (options: {[key: string]: Array<number | void>}) => void
}
const SelectMultiple = (props: Props) => (
  <span className={classes.main}>
    {props.choices.reduce((acc: Array<React.ReactElement<{}>>, optionChoice, optionChoiceIndex) => {
      if (optionChoice !== undefined) {
        return [
          ...acc,
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

      return acc
    }, [])}
  </span>
)

export default SelectMultiple
