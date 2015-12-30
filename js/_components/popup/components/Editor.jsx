import element from 'virtual-element'

function afterRender({props}, el) {
  const isHidden = !props.editorTarget

  setEditorPos(props, el)

  if (!isHidden) {
    // auto focus to title field
    el.getElementsByTagName('input')[0].focus()
  }
}

function clickConfirmHandler(event, {props}) {
  const editorInput = document.getElementById('editor').getElementsByTagName('input')
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
  globals.resetBodySize()

  globals.setRootState({
    editorTarget: null
  })
}

function render({props}) {
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
      <button onClick={closeEditor}>{msgCancel}</button>
    </div>
  )
}

function setEditorPos(props, el) {
  const editorTarget = props.editorTarget

  const isHidden = !editorTarget

  let bottomPosPx = ''
  let leftPosPx = ''

  if (!isHidden) {
    const body = document.body
    const editorHeight = el.offsetHeight
    const editorTargetEl = document.getElementById(editorTarget.id)
    const html = document.getElementsByTagName('html')[0]

    const editorTargetOffset = editorTargetEl.getBoundingClientRect()
    const htmlHeight = html.clientHeight

    const bottomPos = htmlHeight - editorHeight - editorTargetOffset.top

    if (editorHeight > htmlHeight) {
      body.style.height = editorHeight + 'px'
    }

    bottomPosPx = Math.max(bottomPos, 0) + 'px'
    leftPosPx = editorTargetOffset.left + 'px'
  }

  el.style.bottom = bottomPosPx
  el.style.left = leftPosPx
}

export default {afterRender, render}
