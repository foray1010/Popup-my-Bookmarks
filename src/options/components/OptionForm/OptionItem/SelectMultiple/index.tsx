import type { ComponentProps } from 'react'

import Input from '../../../../../core/components/baseItems/Input/index.js'
import PlainList from '../../../../../core/components/baseItems/PlainList/index.js'
import * as classes from './styles.module.css'

type RestInputProps = Readonly<
  Omit<ComponentProps<typeof Input>, 'checked' | 'className' | 'type' | 'value'>
>

type Props = Readonly<
  RestInputProps & {
    choices: ReadonlyArray<string | undefined>
    value: ReadonlyArray<number | undefined>
  }
>
export default function SelectMultiple({
  choices,
  value,
  ...restProps
}: Props) {
  return (
    <PlainList className={classes.main}>
      {choices.map((optionChoice, optionChoiceIndex) => {
        if (optionChoice === undefined) return null
        return (
          <li key={optionChoiceIndex} className={classes['list-item']}>
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
}
