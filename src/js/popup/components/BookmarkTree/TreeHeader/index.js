import {connect} from 'react-redux'

import {removeTreeInfosFromIndex} from '../../../actions'
import TreeHeader from './TreeHeader'

const mapDispatchToProps = {
  removeTreeInfosFromIndex
}

const mapStateToProps = (state, ownProps) => {
  const {treeIndex} = ownProps

  return {
    isHidden: Boolean(treeIndex === 0 || state.searchKeyword),
    treeInfo: state.trees[treeIndex]
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TreeHeader)
