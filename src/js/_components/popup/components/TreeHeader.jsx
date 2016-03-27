import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'

import {
  removeTreeInfosFromIndex
} from '../actions'

const mapStateToProps = (state, ownProps) => ({
  isHidden: Boolean(ownProps.treeIndex === 0 || state.searchKeyword),
  trees: state.trees
})

class TreeHeader extends Component {
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
        <div className='tree-header-box'>
          <div className='tree-header-title no-text-overflow'>{treeInfo.title}</div>
          <div className='tree-header-close' onClick={this.handleClose} />
        </div>
      </header>
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  TreeHeader.propTypes = {
    dispatch: PropTypes.func.isRequired,
    isHidden: PropTypes.bool.isRequired,
    treeIndex: PropTypes.number.isRequired,
    trees: PropTypes.arrayOf(PropTypes.object).isRequired
  }
}

export default connect(mapStateToProps)(TreeHeader)
