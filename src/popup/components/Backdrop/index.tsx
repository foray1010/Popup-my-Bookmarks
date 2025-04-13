import type { MouseEventHandler } from 'react'

import * as classes from './backdrop.module.css'

type Props = Readonly<{
  opacity: number
  onClick: MouseEventHandler
}>
export default function Backdrop({ opacity, onClick }: Props) {
  return (
    <div
      aria-hidden='true'
      className={classes.main}
      role='presentation'
      style={{
        // @ts-expect-error css variable is not supported
        '--opacity': `${opacity * 100}%`,
      }}
      onClick={onClick}
    />
  )
}
