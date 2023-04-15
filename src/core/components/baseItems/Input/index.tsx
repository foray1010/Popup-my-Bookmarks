import classNames from 'classix'
import * as React from 'react'

import classes from './styles.module.css'

type Props = Readonly<React.InputHTMLAttributes<HTMLInputElement>>

const Input = React.forwardRef<HTMLInputElement, Props>(function InnerInput(
  { className, type = 'text', ...props }: Props,
  ref,
) {
  return (
    <input
      {...props}
      ref={ref}
      className={classNames(
        classes['main'],
        ['number', 'text'].includes(type) && classes['text-input'],
        className,
      )}
      type={type}
    />
  )
})

export default Input
