import {autobind, decorate} from 'core-decorators'
import {createElement, PureComponent} from 'react'
import _debounce from 'lodash/debounce'
import PropTypes from 'prop-types'

import '../../../../css/popup/folder-cover.css'

class FolderCover extends PureComponent {
  @decorate(_debounce, 200)
  closeCover() {
    const {
      removeTreeInfosFromIndex,
      treeIndex
    } = this.props

    removeTreeInfosFromIndex(treeIndex + 1)
  }

  @autobind
  handleClick() {
    this.closeCover()
  }

  @autobind
  handleMouseLeave() {
    this.closeCover.cancel()
  }

  @autobind
  handleMouseMove() {
    this.closeCover()
  }

  render() {
    const {isHidden} = this.props

    return (
      <div
        styleName='main'
        hidden={isHidden}
        onClick={this.handleClick}
        onMouseLeave={this.handleMouseLeave}
        onMouseMove={this.handleMouseMove}
      />
    )
  }
}

FolderCover.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  removeTreeInfosFromIndex: PropTypes.func.isRequired,
  treeIndex: PropTypes.number.isRequired
}

export default FolderCover
