import '../../../css/options/external-link.css'

import PropTypes from 'prop-types'
import {createElement} from 'react'

const ExternalLink = (props) => (
  <a styleName='main' href={props.href} target='_blank' rel='noopener noreferrer'>
    {props.children}
  </a>
)

ExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired
}

export default ExternalLink
