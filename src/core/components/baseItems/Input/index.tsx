import classNames from 'classix'
import { forwardRef, type JSX } from 'react'

import * as classes from './styles.module.css'

type Props = Readonly<JSX.IntrinsicElements['input']>
const Input = forwardRef<HTMLInputElement, Props>(function InnerInput(
  { className, type = 'text', ...props },
  ref,
) {
  return (
    <input
      {...props}
      ref={ref}
      className={classNames(
        classes.main,
        ['number', 'text'].includes(type) && classes['text-input'],
        className,
      )}
      type={type}
    />
  )
})

export default Input
