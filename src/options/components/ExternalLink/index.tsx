import classNames from 'classix'
import type { JSX } from 'react'

import * as classes from './styles.module.css'

type Props = Readonly<Omit<JSX.IntrinsicElements['a'], 'rel' | 'target'>>
export default function ExternalLink(props: Props) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...props}
      className={classNames(classes.main, props.className)}
      rel='noopener noreferrer'
      target='_blank'
    />
  )
}
