import '../../../../css/popup/folder-cover.css'

import PropTypes from 'prop-types'
import {createElement} from 'react'

const FolderCover = (props) => (
  <div
    styleName='main'
    hidden={props.isHidden}
    onClick={props.onClick}
    onMouseLeave={props.onMouseLeave}
    onMouseMove={props.onMouseMove}
  />
)

FolderCover.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onMouseMove: PropTypes.func.isRequired
}

export default FolderCover
