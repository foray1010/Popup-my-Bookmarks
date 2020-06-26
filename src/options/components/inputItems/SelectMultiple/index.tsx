import * as React from 'react'

import FieldSet from '../../../../core/components/baseItems/FieldSet'
import Option from './Option'
import classes from './styles.css'

interface Props {
  choices: Array<string | undefined>
  optionName: string
  optionValue: Array<number | undefined>
  updatePartialOptions: (options: {
    [key: string]: Array<number | undefined>
  }) => void
}
const SelectMultiple = (props: Props) => (
  <FieldSet className={classes.main}>
    {props.choices.reduce<Array<React.ReactNode>>(
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
  </FieldSet>
)

export default SelectMultiple
