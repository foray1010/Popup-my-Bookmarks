import classNames from 'classnames'
import * as React from 'react'

import styles from './styles.css'

type Props = React.SelectHTMLAttributes<HTMLSelectElement>

const SelectWithForwardRef = React.forwardRef<HTMLSelectElement, Props>(
  function Select({ className, ...props }: Props, ref) {
    return (
      <select
        {...props}
        ref={ref}
        className={classNames(styles.main, className)}
      />
    )
  },
)

export default SelectWithForwardRef
