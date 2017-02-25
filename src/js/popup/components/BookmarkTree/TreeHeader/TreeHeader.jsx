import {autobind} from 'core-decorators'
import {createElement, PropTypes, PureComponent} from 'react'

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
      <header hidden={isHidden}>
        <div styleName='main'>
          <h1 styleName='title'>
            {treeInfo.title}
          </h1>
          <button
            styleName='close'
            type='button'
            tabIndex='-1'
            onClick={this.handleClose}
          />
        </div>
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
