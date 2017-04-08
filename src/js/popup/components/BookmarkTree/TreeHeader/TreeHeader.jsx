import {autobind} from 'core-decorators'
import {createElement, PureComponent} from 'react'
import PropTypes from 'prop-types'

import '../../../../../css/popup/tree-header.css'

class TreeHeader extends PureComponent {
  @autobind
  handleClose() {
    const {
      removeTreeInfosFromIndex,
      treeIndex
    } = this.props

    removeTreeInfosFromIndex(treeIndex)
  }

  render() {
    const {
      isHidden,
      treeInfo
    } = this.props

    return (
      <header styleName='main' hidden={isHidden}>
        <h1 styleName='title'>
          {treeInfo.title}
        </h1>
        <button
          styleName='close'
          type='button'
          tabIndex='-1'
          onClick={this.handleClose}
        />
      </header>
    )
  }
}

TreeHeader.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  removeTreeInfosFromIndex: PropTypes.func.isRequired,
  treeIndex: PropTypes.number.isRequired,
  treeInfo: PropTypes.object.isRequired
}

export default TreeHeader
