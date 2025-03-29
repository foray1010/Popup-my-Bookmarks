import classNames from 'classix'
import type { FC, JSX } from 'react'

import * as classes from './styles.module.css'

type Props = Readonly<JSX.IntrinsicElements['ul']>

const PlainList: FC<Props> = ({ className, ref, ...props }) => {
  return (
    <ul {...props} ref={ref} className={classNames(classes.main, className)} />
  )
}

export default PlainList
