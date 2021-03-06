import classNames from 'clsx'
import * as React from 'react'

import classes from './styles.module.css'

type Props = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, Props>(function InnerInput(
  { className, type = 'text', ...props }: Props,
  ref,
) {
  return (
    <input
      {...props}
      ref={ref}
      className={classNames(
        classes.main,
        !['checkbox', 'radio'].includes(type) ? classes.textInput : null,
        className,
      )}
      type={type}
    />
  )
})

export default Input
