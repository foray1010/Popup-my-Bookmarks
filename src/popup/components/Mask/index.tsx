import classNames from 'clsx'
import * as React from 'react'

import classes from './mask.module.css'

type Props = React.HTMLAttributes<Element> & {
  readonly opacity: number
}
export default function Mask({ opacity, ...props }: Props) {
  return (
    <div
      {...props}
      className={classNames(classes['main'], props.className)}
      style={React.useMemo(
        () => ({
          ...props.style,
          backgroundColor: `rgba(var(--bg-color-rgb), ${opacity})`,
        }),
        [opacity, props.style],
      )}
    />
  )
}
