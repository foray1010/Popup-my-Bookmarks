import { type ComponentProps, useMemo } from 'react'
import webExtension from 'webextension-polyfill'

import { OPTIONS } from '../../../core/constants/index.js'
import { WindowId } from '../../constants/windows.js'
import useGetBookmarkInfo from '../../modules/bookmarks/hooks/useGetBookmarkInfo.js'
import { createBookmarkAfterId } from '../../modules/bookmarks/methods/createBookmark.js'
import { useOptions } from '../../modules/options.js'
import { FloatingWindow } from '../floatingWindow/index.js'
import { KeyBindingsWindow } from '../keyBindings/index.js'
import { useEditorContext } from './EditorContext.js'
import EditorForm from './EditorForm.js'

type EditorFormProps = Readonly<ComponentProps<typeof EditorForm>>

type CreateEditorFormProps = Readonly<
  EditorFormProps & {
    createAfterId: string
  }
>
function CreateEditorForm({
  createAfterId,
  onConfirm,
  ...editorFormProps
}: CreateEditorFormProps) {
  return (
    <EditorForm
      {...editorFormProps}
      defaultTitle={webExtension.i18n.getMessage('newFolder')}
      onConfirm={async (title: string, url?: string) => {
        await createBookmarkAfterId({ createAfterId, title, url })

        await onConfirm(title, url)
      }}
    />
  )
}

type UpdateEditorFormProps = Readonly<
  EditorFormProps & {
    editTargetId: string
  }
>
function UpdateEditorForm({
  editTargetId,
  onConfirm,
  ...editorFormProps
}: UpdateEditorFormProps) {
  const { data: bookmarkInfo } = useGetBookmarkInfo(editTargetId)

  if (!bookmarkInfo) return null

  return (
    <EditorForm
      {...editorFormProps}
      defaultTitle={bookmarkInfo.title}
      defaultUrl={bookmarkInfo.url}
      onConfirm={async (title: string, url?: string) => {
        await webExtension.bookmarks.update(editTargetId, { title, url })

        await onConfirm(title, url)
      }}
    />
  )
}

export default function Editor() {
  const { close, state } = useEditorContext()

  const options = useOptions()

  const style = useMemo(
    () => ({
      width: `${options[OPTIONS.SET_WIDTH]}px`,
    }),
    [options],
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
      <KeyBindingsWindow windowId={WindowId.Editor}>
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
