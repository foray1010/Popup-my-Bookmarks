import '../../../../../css/popup/tree-header.css'

import PropTypes from 'prop-types'
import {createElement} from 'react'

const TreeHeader = (props) => (
  <header styleName='main' hidden={props.isHidden}>
    <h1 styleName='title'>{props.treeInfo.title}</h1>
    <button styleName='close' type='button' tabIndex='-1' onClick={props.onClose} />
  </header>
)

TreeHeader.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  treeInfo: PropTypes.object.isRequired
}

export default TreeHeader
