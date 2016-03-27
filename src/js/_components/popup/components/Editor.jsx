import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'

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

class Editor extends Component {
  componentDidUpdate() {
    const {editorTarget} = this.props

    const isHidden = !editorTarget

    this.setEditorPosition()

    if (!isHidden) {
      this.titleInput.value = editorTarget.title
      this.urlInput.value = editorTarget.url

      // auto focus to title field
      this.titleInput.focus()
    }
  }

  setEditorPosition() {
    const {editorTarget} = this.props

    const el = this.base
    const isHidden = !editorTarget

    let bottomPositionPx = ''
    let leftPositionPx = ''

    if (!isHidden) {
      const editorHeight = el.offsetHeight
      const editorTargetEl = document.getElementById(editorTarget.id)
      const html = document.getElementsByTagName('html')[0]

      const editorTargetOffset = editorTargetEl.getBoundingClientRect()
      const htmlHeight = html.clientHeight

      const bottomPosition = htmlHeight - editorHeight - editorTargetOffset.top

      if (editorHeight > htmlHeight) {
        document.body.style.height = editorHeight + 'px'
      }

      bottomPositionPx = Math.max(bottomPosition, 0) + 'px'
      leftPositionPx = editorTargetOffset.left + 'px'
    }

    el.style.bottom = bottomPositionPx
    el.style.left = leftPositionPx
  }

  closeEditor() {
    const {dispatch} = this.props

    resetBodySize()

    dispatch(updateEditorTarget(null))
  }

  @autobind
  handleCancel() {
    this.closeEditor()
  }

  @autobind
  async handleConfirm() {
    const {editorTarget} = this.props

    const updatedTitle = this.titleInput.value.trim()

    let updatedUrl

    if (!isFolder(editorTarget)) {
      updatedUrl = this.urlInput.value.trim()
    }

    await chromep.bookmarks.update(editorTarget.id, {
      title: updatedTitle,
      url: updatedUrl
    })

    this.closeEditor()
  }

  render() {
    const {editorTarget} = this.props

    const isHidden = !editorTarget

    let editorTitle = null
    let isFolderItem = false

    if (editorTarget) {
      isFolderItem = isFolder(editorTarget)

      editorTitle = isFolderItem ? msgRename : msgEdit
    }

    return (
      <div
        ref={(ref) => {
          this.base = ref
        }}
        className='editor panel-width'
        hidden={isHidden}
      >
        <span className='editor-title'>{editorTitle}</span>
        <input
          ref={(ref) => {
            this.titleInput = ref
          }}
          type='text'
        />
        <input
          ref={(ref) => {
            this.urlInput = ref
          }}
          type='text'
          hidden={isFolderItem}
        />
        <button onClick={this.handleConfirm}>{msgConfirm}</button>
        <button onClick={this.handleCancel}>{msgCancel}</button>
      </div>
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  Editor.propTypes = {
    dispatch: PropTypes.func.isRequired,
    editorTarget: PropTypes.object
  }
}

const mapStateToProps = (state) => ({
  editorTarget: state.editorTarget
})

export default connect(mapStateToProps)(Editor)
