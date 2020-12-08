import classNames from 'clsx'
import type * as React from 'react'

import Input from '../../../../../core/components/baseItems/Input'
import classes from './styles.css'

type RestInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'max' | 'min' | 'size' | 'type'
>

interface Props extends RestInputProps {
  maximum: number
  minimum: number
}
const InputNumber = ({ className, maximum, minimum, ...restProps }: Props) => {
  return (
    <Input
      className={classNames(classes.main, className)}
      {...restProps}
      max={maximum}
      min={minimum}
      size={Math.floor(Math.log10(maximum)) + 1}
      type='number'
    />
  )
}

export default InputNumber
