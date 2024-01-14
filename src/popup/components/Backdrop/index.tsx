import type { MouseEventHandler } from 'react'

import * as classes from './backdrop.module.css'

type Props = Readonly<{
  opacity: number
  onClick: MouseEventHandler
}>
export default function Backdrop({ opacity, onClick }: Props) {
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
