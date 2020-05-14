import classNames from 'classnames'
import * as React from 'react'

import styles from './styles.css'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ className, type = 'button', ...props }: Props) => (
  <button
    {...props}
    className={classNames(styles.main, className)}
    type={type}
  />
)

export default Button
