import * as React from 'react'

import classes from './external-link.css'

interface Props {
  children: React.ReactNode
  href: string
}
const ExternalLink = (props: Props) => (
  <a
    className={classes.main}
    href={props.href}
    rel='noopener noreferrer'
    target='_blank'
  >
    {props.children}
  </a>
)

export default ExternalLink
