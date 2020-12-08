import * as React from 'react'
import { useSelector } from 'react-redux'
import webExtension from 'webextension-polyfill'

import useAction from '../../../core/hooks/useAction'
import { OPTIONS } from '../../constants'
import { EDITOR_WINDOW } from '../../constants/windows'
import type { RootState } from '../../reduxs'
import { bookmarkCreators, editorCreators } from '../../reduxs'
import AbsolutePosition from '../absolutePosition/AbsolutePosition'
import KeyBindingsWindow from '../keyBindings/KeyBindingsWindow'
import Mask from '../Mask'
import Editor from './Editor'

const EditorContainer = () => {
  const initialTitle = useSelector((state: RootState) => state.editor.title)
  const initialUrl = useSelector((state: RootState) => state.editor.url)
  const isAllowEditUrl = useSelector(
    (state: RootState) => state.editor.isAllowEditUrl,
  )
  const isCreating = useSelector((state: RootState) => state.editor.isCreating)
  const positionLeft = useSelector(
    (state: RootState) => state.editor.positionLeft,
  )
  const positionTop = useSelector(
    (state: RootState) => state.editor.positionTop,
  )
  const targetId = useSelector((state: RootState) => state.editor.targetId)
  const width = useSelector(
    (state: RootState) => state.options[OPTIONS.SET_WIDTH],
  )

  const closeEditor = useAction(editorCreators.closeEditor)
  const createBookmarkAfterId = useAction(
    bookmarkCreators.createBookmarkAfterId,
  )
  const editBookmark = useAction(bookmarkCreators.editBookmark)

  const handleConfirm = React.useCallback(
    (title: string, url: string) => {
      if (targetId) {
        if (isCreating) {
          createBookmarkAfterId(targetId, title, url)
        } else {
          editBookmark(targetId, title, url)
        }
      }
      closeEditor()
    },
    [closeEditor, createBookmarkAfterId, editBookmark, isCreating, targetId],
  )

  return (
    <>
      <Mask opacity={0.3} onClick={closeEditor} />
      <AbsolutePosition positionLeft={positionLeft} positionTop={positionTop}>
        <KeyBindingsWindow windowId={EDITOR_WINDOW}>
          <Editor
            header={
              isAllowEditUrl
                ? webExtension.i18n.getMessage('edit')
                : webExtension.i18n.getMessage('rename')
            }
            initialTitle={initialTitle}
            initialUrl={initialUrl}
            isAllowEditUrl={isAllowEditUrl}
            width={width ?? 0}
            onCancel={closeEditor}
            onConfirm={handleConfirm}
          />
        </KeyBindingsWindow>
      </AbsolutePosition>
    </>
  )
}

export default EditorContainer
