import * as React from 'react'
import {connect} from 'react-redux'
import webExtension from 'webextension-polyfill'

import {OPTIONS} from '../../constants'
import {EDITOR_WINDOW} from '../../constants/windows'
import {RootState, bookmarkCreators, editorCreators} from '../../reduxs'
import AbsolutePosition from '../absolutePosition/AbsolutePosition'
import KeyBindingsWindow from '../keyBindings/KeyBindingsWindow'
import Mask from '../Mask'
import Editor from './Editor'

const mapStateToProps = (state: RootState) => ({
  isAllowEditUrl: state.editor.isAllowEditUrl,
  isCreating: state.editor.isCreating,
  positionLeft: state.editor.positionLeft,
  positionTop: state.editor.positionTop,
  targetId: state.editor.targetId,
  title: state.editor.title,
  url: state.editor.url,
  width: state.options[OPTIONS.SET_WIDTH]
})

const mapDispatchToProps = {
  closeEditor: editorCreators.closeEditor,
  createBookmarkAfterId: bookmarkCreators.createBookmarkAfterId,
  editBookmark: bookmarkCreators.editBookmark
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
const EditorContainer = (props: Props) => {
  const {closeEditor, createBookmarkAfterId, editBookmark, isCreating, targetId} = props

  const handleConfirm = React.useCallback(
    (title: string, url: string) => {
      if (isCreating) {
        if (targetId) createBookmarkAfterId(targetId, title, url)
      } else {
        if (targetId) editBookmark(targetId, title, url)
      }
      closeEditor()
    },
    [closeEditor, createBookmarkAfterId, editBookmark, isCreating, targetId]
  )

  return (
    <React.Fragment>
      <Mask backgroundColor='#fff' opacity={0.3} onClick={props.closeEditor} />
      <AbsolutePosition positionLeft={props.positionLeft} positionTop={props.positionTop}>
        <KeyBindingsWindow windowId={EDITOR_WINDOW}>
          <Editor
            isAllowEditUrl={props.isAllowEditUrl}
            header={
              props.isAllowEditUrl ?
                webExtension.i18n.getMessage('edit') :
                webExtension.i18n.getMessage('rename')
            }
            initialTitle={props.title}
            initialUrl={props.url}
            width={props.width || 0}
            onCancel={props.closeEditor}
            onConfirm={handleConfirm}
          />
        </KeyBindingsWindow>
      </AbsolutePosition>
    </React.Fragment>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorContainer)
