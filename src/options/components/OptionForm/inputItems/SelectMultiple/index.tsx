import type * as React from 'react'

import Input from '../../../../../core/components/baseItems/Input'
import PlainList from '../../../../../core/components/baseItems/PlainList'
import classes from './styles.css'

type RestInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'checked' | 'className' | 'type' | 'value'
>

interface Props extends RestInputProps {
  choices: Array<string | undefined>
  value: Array<number | undefined>
}
const SelectMultiple = ({ choices, value, ...restProps }: Props) => (
  <PlainList className={classes.main}>
    {choices.map((optionChoice, optionChoiceIndex) => {
      if (optionChoice === undefined) return null
      return (
        <li key={optionChoiceIndex}>
          <label>
            <Input
              {...restProps}
              checked={value.includes(optionChoiceIndex)}
              className={classes.checkbox}
              type='checkbox'
              value={optionChoiceIndex}
            />
            {optionChoice}
          </label>
        </li>
      )
    })}
  </PlainList>
)

export default SelectMultiple
