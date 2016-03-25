import {bind} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'

import {
  isFolder,
  resetBodySize
} from '../functions'
import {
  updateEditorTarget
} from '../actions'
import chromep from '../../lib/chromePromise'

const msgCancel = chrome.i18n.getMessage('cancel')
const msgConfirm = chrome.i18n.getMessage('confirm')
const msgEdit = chrome.i18n.getMessage('edit')
const msgRename = chrome.i18n.getMessage('rename')

const mapStateToProps = (state) => ({
  editorTarget: state.editorTarget
})

@connect(mapStateToProps)
class Editor extends Component {
  componentDidUpdate() {
    const {editorTarget} = this.props

    const el = this.base
    const isHidden = !editorTarget

    this.setEditorPosition(el)

    if (!isHidden) {
      // auto focus to title field
      el.getElementsByTagName('input')[0].focus()
    }
  }

  setEditorPosition(el) {
    const {editorTarget} = this.props

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

  @bind
  clickCancelHandler() {
    this.closeEditor()
  }

  @bind
  async clickConfirmHandler() {
    const {editorTarget} = this.props

    const editorInput = this.base.getElementsByTagName('input')

    const updatedTitle = editorInput[0].value.trim()

    let updatedUrl

    if (!isFolder(editorTarget)) {
      updatedUrl = editorInput[1].value.trim()
    }

    await chromep.bookmarks.update(editorTarget.id, {
      title: updatedTitle,
      url: updatedUrl
    })

    this.closeEditor()
  }

  closeEditor() {
    const {dispatch} = this.props

    resetBodySize()

    dispatch(updateEditorTarget(null))
  }

  render(props) {
    const {editorTarget} = props

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
      <div className='editor panel-width' hidden={isHidden}>
        <span className='editor-title'>{editorTitle}</span>
        <input type='text' value={itemTitle} />
        <input type='text' value={itemUrl} hidden={isFolderItem} />
        <button onClick={this.clickConfirmHandler}>{msgConfirm}</button>
        <button onClick={this.clickCancelHandler}>{msgCancel}</button>
      </div>
    )
  }
}

export default Editor
