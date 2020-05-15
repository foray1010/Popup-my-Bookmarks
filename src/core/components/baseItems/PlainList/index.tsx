import classNames from 'classnames'
import * as React from 'react'

import styles from './styles.css'

type Props = React.HTMLAttributes<HTMLUListElement>

const PlainListWithForwardRef = React.forwardRef<HTMLUListElement, Props>(
  function PlainList({ className, ...props }: Props, ref) {
    return (
      <ul {...props} ref={ref} className={classNames(styles.main, className)} />
    )
  },
)

export default PlainListWithForwardRef
