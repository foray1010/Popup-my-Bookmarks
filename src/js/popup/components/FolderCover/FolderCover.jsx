import {autobind, decorate} from 'core-decorators'
import {createElement, PropTypes, PureComponent} from 'react'
import _debounce from 'lodash/debounce'
import CSSModules from 'react-css-modules'

import styles from '../../../../css/popup/folder-cover.css'

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

export default CSSModules(FolderCover, styles)
