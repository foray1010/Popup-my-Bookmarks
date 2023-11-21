import classNames from 'classix'
import * as React from 'react'

import classes from './styles.module.css'

type Props = Readonly<React.JSX.IntrinsicElements['select']>

const Select = React.forwardRef<HTMLSelectElement, Props>(function InnerSelect(
  { className, ...props },
  ref,
) {
  return (
    <select
      {...props}
      ref={ref}
      className={classNames(classes.main, className)}
    />
  )
})

export default Select
