import * as React from 'react'
import { useSelector } from 'react-redux'
import webExtension from 'webextension-polyfill'

import useAction from '../../../core/hooks/useAction'
import { OPTIONS } from '../../constants'
import { EDITOR_WINDOW } from '../../constants/windows'
import { useGetBookmarkInfo } from '../../hooks/bookmarks'
import type { RootState } from '../../reduxs'
import { bookmarkCreators } from '../../reduxs'
import { AbsolutePosition } from '../absolutePosition'
import { KeyBindingsWindow } from '../keyBindings'
import Mask from '../Mask'
import { useEditorContext } from './EditorContext'
import EditorForm from './EditorForm'

type EditorFormProps = React.ComponentProps<typeof EditorForm>

interface CreateEditorFormProps extends EditorFormProps {
  createAfterId: string
}
const CreateEditorForm = ({
  createAfterId,
  onConfirm,
  ...editorFormProps
}: CreateEditorFormProps) => {
  const createBookmarkAfterId = useAction(
    bookmarkCreators.createBookmarkAfterId,
  )

  return (
    <EditorForm
      {...editorFormProps}
      defaultTitle={webExtension.i18n.getMessage('newFolder')}
      onConfirm={React.useCallback(
        (title: string, url: string) => {
          createBookmarkAfterId(createAfterId, title, url)

          onConfirm(title, url)
        },
        [createAfterId, createBookmarkAfterId, onConfirm],
      )}
    />
  )
}

interface UpdateEditorFormProps extends EditorFormProps {
  editTargetId: string
}
const UpdateEditorForm = ({
  editTargetId,
  onConfirm,
  ...editorFormProps
}: UpdateEditorFormProps) => {
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
    <EditorForm
      {...editorFormProps}
      defaultTitle={bookmarkInfo.title}
      defaultUrl={bookmarkInfo.url}
      onConfirm={handleConfirm}
    />
  )
}

export default function Editor() {
  const { close, state } = useEditorContext()

  const width = useSelector(
    (state: RootState) => state.options[OPTIONS.SET_WIDTH],
  )
  const style = React.useMemo(
    () => ({
      width: `${width ?? 0}px`,
    }),
    [width],
  )

  if (!state.isOpen) return null

  const commonProps: EditorFormProps = {
    header: state.isAllowedToEditUrl
      ? webExtension.i18n.getMessage('edit')
      : webExtension.i18n.getMessage('rename'),
    isAllowedToEditUrl: state.isAllowedToEditUrl,
    style,
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
            <CreateEditorForm
              {...commonProps}
              createAfterId={state.createAfterId}
            />
          ) : (
            <UpdateEditorForm
              {...commonProps}
              editTargetId={state.editTargetId}
            />
          )}
        </KeyBindingsWindow>
      </AbsolutePosition>
    </>
  )
}
