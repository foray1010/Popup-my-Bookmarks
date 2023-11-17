import classNames from 'classix'
import * as React from 'react'

import classes from './styles.module.css'

type Props = Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>>

const Button = React.forwardRef<HTMLButtonElement, Props>(function InnerButton(
  { className, type = 'button', ...props }: Props,
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      className={classNames(classes.main, className)}
      // eslint-disable-next-line react/button-has-type
      type={type}
    />
  )
})

export default Button
