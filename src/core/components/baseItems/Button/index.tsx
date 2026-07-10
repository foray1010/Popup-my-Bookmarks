import classNames from 'classix'
import type { FC, JSX } from 'react'

import StylelessButton from '../StylelessButton/index.js'
import * as classes from './styles.module.css'

type Props = Readonly<JSX.IntrinsicElements['button']>

const Button: FC<Props> = ({ className, ...props }) => {
  return (
    <StylelessButton
      {...props}
      className={classNames(classes.main, className)}
    />
  )
}

export default Button
