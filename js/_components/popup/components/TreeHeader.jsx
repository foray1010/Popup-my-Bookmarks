import {bind} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'

import {
  removeTreeInfosFromIndex
} from '../actions'

const mapStateToProps = (state, ownProps) => ({
  isHidden: ownProps.treeIndex === 0 || Boolean(state.searchKeyword),
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

    const treeHeaderBoxClasses = ['tree-header-box']
    const treeInfo = trees[treeIndex]

    if (isHidden) {
      treeHeaderBoxClasses.push('display-none')
    }

    return (
      <header className={treeHeaderBoxClasses.join(' ')}>
        <div className='tree-header-title no-text-overflow'>{treeInfo.title}</div>
        <div className='tree-header-close' onClick={this.closeHandler} />
      </header>
    )
  }
}

export default TreeHeader
