import classNames from 'classix'
import type * as React from 'react'

import classes from './mask.module.css'

type Props = React.HTMLAttributes<Element> & {
  readonly opacity: number
}
export default function Mask({ opacity, ...props }: Props) {
  return (
    <div
      {...props}
      className={classNames(classes['main'], props.className)}
      style={{
        ...props.style,
        backgroundColor: `rgb(var(--bg-color-rgb) / ${opacity})`,
      }}
    />
  )
}
