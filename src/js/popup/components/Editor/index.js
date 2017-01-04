import {connect} from 'react-redux'

import {
  closeEditor
} from '../../actions'
import {
  isFolder
} from '../../functions'
import Editor from './Editor'

const mapDispatchToProps = {
  closeEditor
}

const mapStateToProps = (state) => {
  const {
    editorTarget,
    isCreatingNewFolder
  } = state

  return {
    editorTarget: editorTarget,
    isCreatingNewFolder: isCreatingNewFolder,
    isUIForFolder: (
      isCreatingNewFolder ||
      (editorTarget ? isFolder(editorTarget) : false)
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor)
