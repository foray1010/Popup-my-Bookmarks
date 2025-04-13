import classNames from 'classix'
import type { FC, JSX } from 'react'

import StylelessButton from '../StylelessButton'
import * as classes from './styles.module.css'

type Props = Readonly<JSX.IntrinsicElements['button']>

const Button: FC<Props> = ({ className, ref, ...props }) => {
  return (
    <StylelessButton
      {...props}
      ref={ref}
      className={classNames(classes.main, className)}
    />
  )
}

export default Button
