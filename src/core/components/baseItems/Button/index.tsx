import classNames from 'classnames'
import * as React from 'react'

import styles from './styles.css'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

const ButtonWithForwardRef = React.forwardRef<HTMLButtonElement, Props>(
  function Button({ className, type = 'button', ...props }: Props, ref) {
    return (
      <button
        {...props}
        ref={ref}
        className={classNames(styles.main, className)}
        type={type}
      />
    )
  },
)

export default ButtonWithForwardRef
