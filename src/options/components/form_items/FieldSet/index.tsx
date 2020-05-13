import classNames from 'classnames'
import * as React from 'react'

import styles from './styles.css'

type Props = React.FieldsetHTMLAttributes<HTMLFieldSetElement>

const FieldSet = ({ className, ...props }: Props) => (
  <fieldset {...props} className={classNames(styles.main, className)} />
)

export default FieldSet
