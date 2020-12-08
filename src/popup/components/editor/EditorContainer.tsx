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
import { useEditorContext } from './useEditor'

const EditorContainer = () => {
  const { close, state } = useEditorContext()

  const { data: bookmarkInfo, isLoading } = useGetBookmarkInfo(
    state.isOpen && !state.isCreating ? state.editTargetId : undefined,
  )
  const [initialTitle, setInitialTitle] = React.useState('')
  const [initialUrl, setInitialUrl] = React.useState('')
  React.useEffect(() => {
    if (bookmarkInfo) {
      setInitialTitle(bookmarkInfo.title)
      setInitialUrl(bookmarkInfo.url ?? '')
    }
  }, [bookmarkInfo])

  const width = useSelector(
    (state: RootState) => state.options[OPTIONS.SET_WIDTH],
  )

  const createBookmarkAfterId = useAction(
    bookmarkCreators.createBookmarkAfterId,
  )
  const editBookmark = useAction(bookmarkCreators.editBookmark)

  const handleConfirm = React.useCallback(
    (title: string, url: string) => {
      if (!state.isOpen) return

      if (state.isCreating) {
        createBookmarkAfterId(state.createAfterId, title, url)
      } else {
        editBookmark(state.editTargetId, title, url)
      }

      close()
    },
    [close, createBookmarkAfterId, editBookmark, state],
  )

  if (!state.isOpen || isLoading) return null

  return (
    <>
      <Mask opacity={0.3} onClick={close} />
      <AbsolutePosition
        positionLeft={state.positions.left}
        positionTop={state.positions.top}
      >
        <KeyBindingsWindow windowId={EDITOR_WINDOW}>
          <Editor
            header={
              state.isAllowedToEditUrl
                ? webExtension.i18n.getMessage('edit')
                : webExtension.i18n.getMessage('rename')
            }
            initialTitle={initialTitle}
            initialUrl={initialUrl}
            isAllowedToEditUrl={state.isAllowedToEditUrl}
            width={width ?? 0}
            onCancel={close}
            onConfirm={handleConfirm}
          />
        </KeyBindingsWindow>
      </AbsolutePosition>
    </>
  )
}

export default EditorContainer
