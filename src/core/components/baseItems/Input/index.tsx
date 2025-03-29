import classNames from 'classix'
import type { FC, JSX } from 'react'

import * as classes from './styles.module.css'

type Props = Readonly<JSX.IntrinsicElements['input']>
const Input: FC<Props> = ({ className, ref, type = 'text', ...props }) => {
  return (
    <input
      {...props}
      ref={ref}
      className={classNames(
        classes.main,
        ['number', 'text'].includes(type) && classes['text-input'],
        className,
      )}
      type={type}
    />
  )
}

export default Input
