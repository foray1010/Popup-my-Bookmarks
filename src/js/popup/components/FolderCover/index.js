import {connect} from 'react-redux'

import FolderCover from './FolderCover'
import {removeTreeInfosFromIndex} from '../../actions'

const mapDispatchToProps = {
  removeTreeInfosFromIndex
}

const mapStateToProps = (state, ownProps) => ({
  // hide the folder if it is not the top two folder
  isHidden: state.trees.length - ownProps.treeIndex <= 2
})

export default connect(mapStateToProps, mapDispatchToProps)(FolderCover)
