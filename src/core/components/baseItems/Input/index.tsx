import classNames from 'classnames'
import * as React from 'react'

import classes from './styles.css'

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
        !['checkbox', 'radio'].includes(type) ? classes['text-input'] : null,
        className,
      )}
      type={type}
    />
  )
})

export default Input
