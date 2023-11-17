import classNames from 'classix'
import * as React from 'react'

import classes from './styles.module.css'

type Props = Readonly<React.HTMLAttributes<HTMLUListElement>>

const PlainList = React.forwardRef<HTMLUListElement, Props>(
  function InnerPlainList({ className, ...props }: Props, ref) {
    return (
      <ul
        {...props}
        ref={ref}
        className={classNames(classes.main, className)}
      />
    )
  },
)

export default PlainList
