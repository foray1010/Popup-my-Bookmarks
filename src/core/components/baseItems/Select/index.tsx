import classNames from 'classix'
import { forwardRef, type JSX } from 'react'

import * as classes from './styles.module.css'

type Props = Readonly<JSX.IntrinsicElements['select']>
const Select = forwardRef<HTMLSelectElement, Props>(function InnerSelect(
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
