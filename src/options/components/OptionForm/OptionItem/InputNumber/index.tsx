import classNames from 'classix'
import type * as React from 'react'

import Input from '../../../../../core/components/baseItems/Input/index.js'
import classes from './styles.module.css'

type RestInputProps = Readonly<
  Omit<React.ComponentProps<typeof Input>, 'max' | 'min' | 'size' | 'type'>
>

type Props = Readonly<
  RestInputProps & {
    maximum: number
    minimum: number
  }
>
export default function InputNumber({
  className,
  maximum,
  minimum,
  ...restProps
}: Props) {
  return (
    <Input
      className={classNames(classes.main, className)}
      {...restProps}
      max={maximum}
      min={minimum}
      size={Math.floor(Math.log10(maximum)) + 1}
      step={1}
      type='number'
    />
  )
}
