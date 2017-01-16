import {createElement, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import styles from '../../../css/options/external-link.css'

const ExternalLink = (props) => (
  <a
    styleName='main'
    href={props.href}
    target='_blank'
    rel='noopener noreferrer'
  >
    {props.children}
  </a>
)

ExternalLink.propTypes = {
  children: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired
}

export default CSSModules(ExternalLink, styles)
