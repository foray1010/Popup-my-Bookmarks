import classNames from 'classnames'
import * as React from 'react'

import styles from './styles.css'

type Props = React.InputHTMLAttributes<HTMLInputElement>

const InputWithForwardRef = React.forwardRef<HTMLInputElement, Props>(
  function Input({ className, type = 'text', ...props }: Props, ref) {
    return (
      <input
        {...props}
        ref={ref}
        className={classNames(styles.main, className)}
        type={type}
      />
    )
  },
)

export default InputWithForwardRef
