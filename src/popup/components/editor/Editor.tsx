import * as React from 'react'
import webExtension from 'webextension-polyfill'

import { OPTIONS } from '../../constants'
import { EDITOR_WINDOW } from '../../constants/windows'
import useGetBookmarkInfo from '../../modules/bookmarks/hooks/useGetBookmarkInfo'
import { createBookmarkAfterId } from '../../modules/bookmarks/methods/createBookmark'
import { useOptions } from '../../modules/options'
import { FloatingWindow } from '../floatingWindow'
import { KeyBindingsWindow } from '../keyBindings'
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
  return (
    <EditorForm
      {...editorFormProps}
      defaultTitle={webExtension.i18n.getMessage('newFolder')}
      onConfirm={React.useCallback(
        async (title: string, url: string) => {
          await createBookmarkAfterId({ createAfterId, title, url })

          onConfirm(title, url)
        },
        [createAfterId, onConfirm],
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

  const handleConfirm = React.useCallback(
    async (title: string, url?: string) => {
      await webExtension.bookmarks.update(editTargetId, { title, url })

      onConfirm(title, url)
    },
    [editTargetId, onConfirm],
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

  const options = useOptions()

  const width = options[OPTIONS.SET_WIDTH]

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
    <FloatingWindow
      positionLeft={state.positions.left}
      positionTop={state.positions.top}
      onClose={close}
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
    </FloatingWindow>
  )
}
