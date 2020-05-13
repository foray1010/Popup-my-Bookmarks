import * as React from 'react'

import FieldSet from '../../../../core/components/baseItems/FieldSet'
import { OPTIONS } from '../../../../core/constants'
import { Options } from '../../../../core/types/options'
import Option from './Option'
import classes from './styles.css'

interface Props<T = string> {
  choices: Map<T, string>
  optionName: OPTIONS
  optionValue: Array<T>
  updatePartialOptions: (options: Partial<Options>) => void
}
const SelectMultiple = (props: Props) => (
  <FieldSet className={classes.main}>
    {Array.from(props.choices).map(([optionChoice, description]) => (
      <Option
        key={optionChoice}
        description={description}
        optionChoice={optionChoice}
        optionName={props.optionName}
        optionValue={props.optionValue}
        updatePartialOptions={props.updatePartialOptions}
      />
    ))}
  </FieldSet>
)

export default SelectMultiple
