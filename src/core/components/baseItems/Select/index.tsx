import classNames from 'classix'
import type { FC, JSX } from 'react'

import * as classes from './styles.module.css'

type Props = Readonly<JSX.IntrinsicElements['select']>
const Select: FC<Props> = ({ className, ref, ...props }) => {
  return (
    <select
      {...props}
      ref={ref}
      className={classNames(classes.main, className)}
    />
  )
}

export default Select
