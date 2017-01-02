import {autobind, decorate} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, PropTypes, PureComponent} from 'react'
import _debounce from 'lodash/debounce'
import CSSModules from 'react-css-modules'

import {
  removeTreeInfosFromIndex
} from '../actions'

import styles from '../../../css/popup/folder-cover.css'

class FolderCover extends PureComponent {
  @decorate(_debounce, 200)
  closeCover() {
    const {
      dispatch,
      treeIndex
    } = this.props

    dispatch(removeTreeInfosFromIndex(treeIndex + 1))
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
  dispatch: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired,
  treeIndex: PropTypes.number.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  // hide the folder if it is not the top two folder
  isHidden: state.trees.length - ownProps.treeIndex <= 2
})

export default connect(mapStateToProps)(
  CSSModules(FolderCover, styles)
)
