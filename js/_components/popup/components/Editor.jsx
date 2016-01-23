import {element} from 'deku'

import {
  isFolder,
  resetBodySize
} from '../functions'
import {
  updateEditorTarget
} from '../actions'

const msgCancel = chrome.i18n.getMessage('cancel')
const msgConfirm = chrome.i18n.getMessage('confirm')
const msgEdit = chrome.i18n.getMessage('edit')
const msgRename = chrome.i18n.getMessage('rename')

const clickCancelHandler = (model) => () => {
  const {dispatch} = model

  closeEditor(dispatch)
}

const clickConfirmHandler = (model) => () => {
  const {context, dispatch, path} = model

  const {editorTarget} = context

  const editorInput = document.getElementById(path).getElementsByTagName('input')

  const updatedTitle = editorInput[0].value

  let updatedUrl

  if (!isFolder(editorTarget)) {
    updatedUrl = editorInput[1].value
  }

  chrome.bookmarks.update(editorTarget.id, {
    title: updatedTitle,
    url: updatedUrl
  })

  closeEditor(dispatch)
}

function closeEditor(dispatch) {
  resetBodySize()

  dispatch(updateEditorTarget(null))
}

function setEditorPosition(context, el) {
  const {editorTarget} = context

  const isHidden = !editorTarget

  let bottomPositionPx = ''
  let leftPositionPx = ''

  if (!isHidden) {
    const body = document.body
    const editorHeight = el.offsetHeight
    const editorTargetEl = document.getElementById(editorTarget.id)
    const html = document.getElementsByTagName('html')[0]

    const editorTargetOffset = editorTargetEl.getBoundingClientRect()
    const htmlHeight = html.clientHeight

    const bottomPosition = htmlHeight - editorHeight - editorTargetOffset.top

    if (editorHeight > htmlHeight) {
      body.style.height = editorHeight + 'px'
    }

    bottomPositionPx = Math.max(bottomPosition, 0) + 'px'
    leftPositionPx = editorTargetOffset.left + 'px'
  }

  el.style.bottom = bottomPositionPx
  el.style.left = leftPositionPx
}

const Editor = {
  onUpdate(model) {
    const {context, path} = model

    const el = document.getElementById(path)
    const isHidden = !context.editorTarget

    setEditorPosition(context, el)

    if (!isHidden) {
      // auto focus to title field
      el.getElementsByTagName('input')[0].focus()
    }
  },

  render(model) {
    const {context, path} = model

    const {editorTarget} = context

    const isHidden = !editorTarget

    let editorTitle = null
    let isFolderItem = false
    let itemTitle = null
    let itemUrl = null

    if (editorTarget) {
      itemTitle = editorTarget.title
      itemUrl = editorTarget.url

      isFolderItem = isFolder(editorTarget)

      editorTitle = isFolderItem ? msgRename : msgEdit
    }

    return (
      <div id={path} class='editor panel-width' hidden={isHidden}>
        <span class='editor-title'>{editorTitle}</span>
        <input type='text' value={itemTitle} />
        <input type='text' value={itemUrl} hidden={isFolderItem} />
        <button onClick={clickConfirmHandler(model)}>{msgConfirm}</button>
        <button onClick={clickCancelHandler(model)}>{msgCancel}</button>
      </div>
    )
  }
}

export default Editor
