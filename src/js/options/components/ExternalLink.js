// @flow strict
// @jsx createElement

import '../../../css/options/external-link.css'

import {createElement} from 'react'
import type {Node} from 'react'

type Props = {|
  children: Node,
  href: string
|}
const ExternalLink = (props: Props) => (
  <a styleName='main' href={props.href} target='_blank' rel='noopener noreferrer'>
    {props.children}
  </a>
)

export default ExternalLink
