// @flow
// @jsx createElement

import '../../../css/options/external-link.css'

import {createElement} from 'react'
import type {Element} from 'react'

type Props = {
  children: string | Element<*>,
  href: string
};
const ExternalLink = (props: Props) => (
  <a styleName='main' href={props.href} target='_blank' rel='noopener noreferrer'>
    {props.children}
  </a>
)

export default ExternalLink
