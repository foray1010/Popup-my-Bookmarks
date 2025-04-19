import classNames from 'classix'
import type { ComponentProps } from 'react'

import Select from '@/core/components/baseItems/Select/index.js'

import * as classes from './styles.module.css'

type Props = Readonly<
  ComponentProps<typeof Select> & {
    choices: ReadonlyArray<string>
  }
>
export default function SelectString({
  choices,
  className,
  ...restProps
}: Props) {
  return (
    <Select className={classNames(classes.main, className)} {...restProps}>
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
