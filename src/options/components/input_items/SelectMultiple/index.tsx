import * as React from 'react'

import Option from './Option'
import classes from './select-multiple.css'

interface Props {
  choices: Array<string | void>
  optionName: string
  optionValue: Array<number | void>
  updatePartialOptions: (options: {
    [key: string]: Array<number | void>
  }) => void
}
const SelectMultiple = (props: Props) => (
  <span className={classes.main}>
    {props.choices.reduce<Array<React.ReactElement<{}>>>(
      (acc, optionChoice, optionChoiceIndex) => {
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
            />,
          ]
        }

        return acc
      },
      [],
    )}
  </span>
)

export default SelectMultiple
