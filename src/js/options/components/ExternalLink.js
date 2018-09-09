// @flow strict @jsx createElement

import {createElement} from 'react'
import type {Node} from 'react'

import classes from '../../../css/options/external-link.css'

type Props = {|
  children: Node,
  href: string
|}
const ExternalLink = (props: Props) => (
  <a className={classes.main} href={props.href} target='_blank' rel='noopener noreferrer'>
    {props.children}
  </a>
)

export default ExternalLink
