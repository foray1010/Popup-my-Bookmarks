import classNames from 'classix'
import type * as React from 'react'

import classes from './styles.module.css'

type Props = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'rel' | 'target'
>
export default function ExternalLink(props: Props) {
  return (
    <a
      {...props}
      className={classNames(classes['main'], props.className)}
      rel='noopener noreferrer'
      target='_blank'
    />
  )
}
