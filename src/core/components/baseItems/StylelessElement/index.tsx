import classNames from 'clsx'
import * as React from 'react'

import classes from './styles.module.css'

type Props = React.HTMLAttributes<HTMLDivElement>

const StylelessElement = React.forwardRef<HTMLDivElement, Props>(
  function InnerStylelessElement({ className, ...props }: Props, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={classNames(classes['main'], className)}
      />
    )
  },
)

export default StylelessElement
