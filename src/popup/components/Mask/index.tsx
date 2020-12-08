import classNames from 'clsx'
import * as React from 'react'

import classes from './mask.css'

type Props = React.HTMLAttributes<Element> & {
  opacity: number
}
export default function Mask({ opacity, ...props }: Props) {
  return (
    <div
      {...props}
      className={classNames(classes.main, props.className)}
      style={React.useMemo(
        () => ({
          ...props.style,
          opacity,
        }),
        [opacity, props.style],
      )}
    />
  )
}
