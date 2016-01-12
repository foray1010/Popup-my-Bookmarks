import {element} from 'deku'

import {updateEditorTarget} from '../actions'

const editorId = 'editor'
const msgCancel = chrome.i18n.getMessage('cancel')
const msgConfirm = chrome.i18n.getMessage('confirm')
const msgEdit = chrome.i18n.getMessage('edit')
const msgRename = chrome.i18n.getMessage('rename')

const clickCancelHandler = (model) => () => {
  const {dispatch} = model

  closeEditor(dispatch)
}

const clickConfirmHandler = (model) => () => {
  const {context, dispatch} = model

  const {editorTarget} = context

  const editorInput = document.getElementById(editorId).getElementsByTagName('input')

  const updatedTitle = editorInput[0].value

  let updatedUrl

  if (!globals.isFolder(editorTarget)) {
    updatedUrl = editorInput[1].value
  }

  chrome.bookmarks.update(editorTarget.id, {
    title: updatedTitle,
    url: updatedUrl
  })

  closeEditor(dispatch)
}

function closeEditor(dispatch) {
  globals.resetBodySize()

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
    const {context} = model

    const el = document.getElementById(editorId)
    const isHidden = !context.editorTarget

    setEditorPosition(context, el)

    if (!isHidden) {
      // auto focus to title field
      el.getElementsByTagName('input')[0].focus()
    }
  },

  render(model) {
    const {context} = model

    const {editorTarget} = context

    const isHidden = !editorTarget

    let editorTitle
    let isFolderItem = false
    let itemTitle
    let itemUrl

    if (editorTarget) {
      itemTitle = editorTarget.title
      itemUrl = editorTarget.url

      isFolderItem = globals.isFolder(editorTarget)

      editorTitle = isFolderItem ? msgRename : msgEdit
    }

    return (
      <div id={editorId} class='panel-width' hidden={isHidden}>
        <span id='editor-title'>{editorTitle}</span>
        <input type='text' value={itemTitle} />
        <input type='text' value={itemUrl} hidden={isFolderItem} />
        <button onClick={clickConfirmHandler(model)}>{msgConfirm}</button>
        <button onClick={clickCancelHandler(model)}>{msgCancel}</button>
      </div>
    )
  }
}

export default Editor
