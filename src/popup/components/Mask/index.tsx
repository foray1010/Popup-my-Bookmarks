import type * as React from 'react'

import classes from './mask.module.css'

type Props = Readonly<{
  opacity: number
  onClick: React.MouseEventHandler
}>
export default function Mask({ opacity, onClick }: Props) {
  return (
    <div
      className={classes.main}
      style={{
        backgroundColor: `rgb(var(--bg-color-rgb) / ${opacity})`,
      }}
      onClick={onClick}
    />
  )
}
