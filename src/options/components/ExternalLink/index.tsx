import classNames from 'classix'
import type { JSX } from 'react'

import classes from './styles.module.css'

type Props = Readonly<Omit<JSX.IntrinsicElements['a'], 'rel' | 'target'>>
export default function ExternalLink(props: Props) {
  return (
    <a
      {...props}
      className={classNames(classes.main, props.className)}
      rel='noopener noreferrer'
      target='_blank'
    />
  )
}
