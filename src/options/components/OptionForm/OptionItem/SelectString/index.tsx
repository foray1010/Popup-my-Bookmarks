import classNames from 'clsx'
import type * as React from 'react'

import Select from '../../../../../core/components/baseItems/Select'
import classes from './styles.module.css'

interface Props extends React.ComponentProps<typeof Select> {
  readonly choices: ReadonlyArray<string>
}
export default function SelectString({
  choices,
  className,
  ...restProps
}: Props) {
  return (
    <Select className={classNames(classes['main'], className)} {...restProps}>
      {choices.map((optionChoice, optionChoiceIndex) => {
        return (
          <option key={optionChoiceIndex} value={optionChoiceIndex}>
            {optionChoice}
          </option>
        )
      })}
    </Select>
  )
}
