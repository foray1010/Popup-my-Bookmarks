import * as React from 'react'
import { useSelector } from 'react-redux'
import webExtension from 'webextension-polyfill'

import useAction from '../../../core/hooks/useAction'
import { OPTIONS } from '../../constants'
import { EDITOR_WINDOW } from '../../constants/windows'
import { useGetBookmarkInfo } from '../../hooks/bookmarks'
import type { RootState } from '../../reduxs'
import { bookmarkCreators } from '../../reduxs'
import AbsolutePosition from '../absolutePosition/AbsolutePosition'
import KeyBindingsWindow from '../keyBindings/KeyBindingsWindow'
import Mask from '../Mask'
import Editor from './Editor'
import { useEditorContext } from './EditorContext'

type EditorProps = React.ComponentProps<typeof Editor>

interface CreateEditorProps extends EditorProps {
  createAfterId: string
}
const CreateEditor = ({
  createAfterId,
  onConfirm,
  ...editorProps
}: CreateEditorProps) => {
  const createBookmarkAfterId = useAction(
    bookmarkCreators.createBookmarkAfterId,
  )

  const handleConfirm = React.useCallback(
    (title: string, url: string) => {
      createBookmarkAfterId(createAfterId, title, url)

      onConfirm(title, url)
    },
    [createAfterId, createBookmarkAfterId, onConfirm],
  )

  return (
    <Editor
      {...editorProps}
      defaultTitle={webExtension.i18n.getMessage('newFolder')}
      onConfirm={handleConfirm}
    />
  )
}

interface UpdateEditorProps extends EditorProps {
  editTargetId: string
}
const UpdateEditor = ({
  editTargetId,
  onConfirm,
  ...editorProps
}: UpdateEditorProps) => {
  const { data: bookmarkInfo } = useGetBookmarkInfo(editTargetId)

  const editBookmark = useAction(bookmarkCreators.editBookmark)

  const handleConfirm = React.useCallback(
    (title: string, url: string) => {
      editBookmark(editTargetId, title, url)

      onConfirm(title, url)
    },
    [editBookmark, editTargetId, onConfirm],
  )

  if (!bookmarkInfo) return null

  return (
    <Editor
      {...editorProps}
      defaultTitle={bookmarkInfo.title}
      defaultUrl={bookmarkInfo.url}
      onConfirm={handleConfirm}
    />
  )
}

export default function EditorContainer() {
  const { close, state } = useEditorContext()

  const width = useSelector(
    (state: RootState) => state.options[OPTIONS.SET_WIDTH],
  )

  if (!state.isOpen) return null

  const commonProps: EditorProps = {
    header: state.isAllowedToEditUrl
      ? webExtension.i18n.getMessage('edit')
      : webExtension.i18n.getMessage('rename'),
    isAllowedToEditUrl: state.isAllowedToEditUrl,
    width: width ?? 0,
    onCancel: close,
    onConfirm: close,
  }
  return (
    <>
      <Mask opacity={0.3} onClick={close} />
      <AbsolutePosition
        positionLeft={state.positions.left}
        positionTop={state.positions.top}
      >
        <KeyBindingsWindow windowId={EDITOR_WINDOW}>
          {state.isCreating ? (
            <CreateEditor
              {...commonProps}
              createAfterId={state.createAfterId}
            />
          ) : (
            <UpdateEditor {...commonProps} editTargetId={state.editTargetId} />
          )}
        </KeyBindingsWindow>
      </AbsolutePosition>
    </>
  )
}
