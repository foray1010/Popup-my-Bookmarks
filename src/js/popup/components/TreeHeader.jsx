import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, PropTypes, PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import {
  removeTreeInfosFromIndex
} from '../actions'

import styles from '../../../css/popup/tree-header.css'

class TreeHeader extends PureComponent {
  @autobind
  handleClose() {
    const {
      dispatch,
      treeIndex
    } = this.props

    dispatch(removeTreeInfosFromIndex(treeIndex))
  }

  render() {
    const {
      isHidden,
      treeIndex,
      trees
    } = this.props

    const treeInfo = trees[treeIndex]

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
  dispatch: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired,
  treeIndex: PropTypes.number.isRequired,
  trees: PropTypes.arrayOf(PropTypes.object).isRequired
}

const mapStateToProps = (state, ownProps) => ({
  isHidden: Boolean(ownProps.treeIndex === 0 || state.searchKeyword),
  trees: state.trees
})

export default connect(mapStateToProps)(
  CSSModules(TreeHeader, styles)
)
