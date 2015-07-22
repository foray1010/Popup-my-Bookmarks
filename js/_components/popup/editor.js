import {element} from 'deku'

function afterRender({props}, el) {
  const editorTarget = props.editorTarget

  const isHidden = !editorTarget

  if (!isHidden) {
    setEditorPos(el, document.getElementById(editorTarget.id))

    // auto focus to title field
    el.getElementsByTagName('input')[0].focus()
  }
}

function clickCancelHandler(event, {props, state}) {
  closeEditor()
}

function clickConfirmHandler(event, {props, state}) {
  const editorInput = document.getElementById('editor')
    .getElementsByTagName('input')
  const editorTarget = props.editorTarget

  const updatedTitle = editorInput[0].value

  let updatedUrl

  if (!globals.isFolder(editorTarget)) {
    updatedUrl = editorInput[1].value
  }

  chrome.bookmarks.update(editorTarget.id, {
    title: updatedTitle,
    url: updatedUrl
  })

  closeEditor()
}

function closeEditor() {
  globals.setRootState({
    editorTarget: null
  })
}

function render({props, state}) {
  const editorTarget = props.editorTarget
  const msgCancel = chrome.i18n.getMessage('cancel')
  const msgConfirm = chrome.i18n.getMessage('confirm')

  const isHidden = !editorTarget

  let editorTitle
  let isFolderItem
  let itemTitle
  let itemUrl

  if (editorTarget) {
    itemTitle = editorTarget.title
    itemUrl = editorTarget.url

    isFolderItem = globals.isFolder(editorTarget)

    editorTitle = chrome.i18n.getMessage(isFolderItem ? 'rename' : 'edit')
  }

  return (
    <div id='editor' class='panel-width' hidden={isHidden}>
      <span id='editor-title'>{editorTitle}</span>
      <input type='text' value={itemTitle} />
      <input type='text' value={itemUrl} hidden={isFolderItem} />
      <button onClick={clickConfirmHandler}>{msgConfirm}</button>
      <button onClick={clickCancelHandler}>{msgCancel}</button>
    </div>
  )
}

function setEditorPos(el, editorTargetEl) {
  const body = document.body
  const editorHeight = el.offsetHeight
  const editorWidth = el.offsetWidth
  const targetOffsetTop = editorTargetEl.getBoundingClientRect().top

  const bodyHeight = body.scrollHeight
  const bodyWidth = body.offsetWidth

  const bottomPos = bodyHeight - editorHeight - targetOffsetTop
  const rightPos = bodyWidth - editorWidth

  el.style.bottom = Math.max(bottomPos, 0) + 'px'
  el.style.right = Math.max(rightPos, 0) + 'px'
}

export default {afterRender, render}
