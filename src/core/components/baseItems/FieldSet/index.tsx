import classNames from 'classnames'
import * as React from 'react'

import styles from './styles.css'

type Props = React.FieldsetHTMLAttributes<HTMLFieldSetElement>

const FieldSetWithForwardRef = React.forwardRef<HTMLFieldSetElement, Props>(
  function FieldSet({ className, ...props }: Props, ref) {
    return (
      <fieldset
        {...props}
        ref={ref}
        className={classNames(styles.main, className)}
      />
    )
  },
)

export default FieldSetWithForwardRef
