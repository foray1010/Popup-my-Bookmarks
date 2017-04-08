import {createElement} from 'react'
import PropTypes from 'prop-types'

import '../../../css/options/external-link.css'

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
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired
}

export default ExternalLink
