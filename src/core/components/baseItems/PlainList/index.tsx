import classNames from 'classix'
import { forwardRef, type JSX } from 'react'

import classes from './styles.module.css'

type Props = Readonly<JSX.IntrinsicElements['ul']>

const PlainList = forwardRef<HTMLUListElement, Props>(function InnerPlainList(
  { className, ...props },
  ref,
) {
  return (
    <ul {...props} ref={ref} className={classNames(classes.main, className)} />
  )
})

export default PlainList
