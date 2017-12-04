import {connect} from 'react-redux'

import Editor from './Editor'
import {closeEditor} from '../../actions'
import {isFolder} from '../../functions'

const mapDispatchToProps = {
  closeEditor
}

const mapStateToProps = (state) => {
  const {editorTarget, isCreatingNewFolder} = state

  return {
    editorTarget,
    isCreatingNewFolder,
    isUIForFolder: isCreatingNewFolder || (editorTarget ? isFolder(editorTarget) : false)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
