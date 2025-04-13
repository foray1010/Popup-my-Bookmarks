import classNames from 'classix'
import type { FC, JSX } from 'react'

import * as classes from './styles.module.css'

type Props = Readonly<JSX.IntrinsicElements['button']>

const StylelessButton: FC<Props> = ({
  className,
  ref,
  type = 'button',
  ...props
}) => {
  return (
    <button
      {...props}
      ref={ref}
      className={classNames(classes['unset-all'], classes.main, className)}
      // eslint-disable-next-line react/button-has-type
      type={type}
    />
  )
}

export default StylelessButton
