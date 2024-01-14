import classNames from 'classix'
import { forwardRef, type JSX } from 'react'

import * as classes from './styles.module.css'

type Props = Readonly<JSX.IntrinsicElements['button']>

const Button = forwardRef<HTMLButtonElement, Props>(function InnerButton(
  { className, type = 'button', ...props },
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
