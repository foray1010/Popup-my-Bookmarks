import classNames from 'classnames'
import * as React from 'react'

import styles from './styles.css'

type Props = React.HTMLAttributes<HTMLDivElement>

const StylelessElementWithForwardRef = React.forwardRef<HTMLDivElement, Props>(
  function StylelessElement({ className, ...props }: Props, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={classNames(styles.main, className)}
      />
    )
  },
)

export default StylelessElementWithForwardRef
