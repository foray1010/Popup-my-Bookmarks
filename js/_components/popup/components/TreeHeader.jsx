import {bind} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'

import {
  removeTreeInfosFromIndex
} from '../actions'

const mapStateToProps = (state, ownProps) => ({
  isHidden: Boolean(ownProps.treeIndex === 0 || state.searchKeyword),
  trees: state.trees
})

@connect(mapStateToProps)
class TreeHeader extends Component {
  @bind
  closeHandler() {
    const {
      dispatch,
      treeIndex
    } = this.props

    dispatch(removeTreeInfosFromIndex(treeIndex))
  }

  render(props) {
    const {
      isHidden,
      treeIndex,
      trees
    } = props

    const treeInfo = trees[treeIndex]

    return (
      <header hidden={isHidden}>
        <div className='tree-header-box'>
          <div className='tree-header-title no-text-overflow'>{treeInfo.title}</div>
          <div className='tree-header-close' onClick={this.closeHandler} />
        </div>
      </header>
    )
  }
}

export default TreeHeader
