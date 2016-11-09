import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, PropTypes, PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import {
  isFolder,
  resetBodySize
} from '../functions'
import {
  updateEditorTarget
} from '../actions'
import chromep from '../../common/lib/chromePromise'

import styles from '../../../css/popup/editor.css'

const msgCancel = chrome.i18n.getMessage('cancel')
const msgConfirm = chrome.i18n.getMessage('confirm')
const msgEdit = chrome.i18n.getMessage('edit')
const msgNewFolder = chrome.i18n.getMessage('newFolder')
const msgRename = chrome.i18n.getMessage('rename')

class Editor extends PureComponent {
  componentDidUpdate() {
    const {
      editorTarget,
      isCreatingNewFolder
    } = this.props

    const isHidden = !editorTarget

    this.setEditorPosition()

    if (!isHidden) {
      if (isCreatingNewFolder) {
        this.titleInputEl.value = msgNewFolder
      } else {
        this.titleInputEl.value = editorTarget.title
        this.urlInputEl.value = editorTarget.url
      }

      // auto focus to title field
      this.titleInputEl.focus()
    }
  }

  setEditorPosition() {
    const {editorTarget} = this.props

    const {baseEl} = this
    const isHidden = !editorTarget

    let bottomPositionPx = ''
    let leftPositionPx = ''

    if (!isHidden) {
      const editorHeight = baseEl.offsetHeight
      const editorTargetEl = document.getElementById(editorTarget.id)
      const html = document.documentElement

      const editorTargetOffset = editorTargetEl.getBoundingClientRect()
      const htmlHeight = html.clientHeight

      const bottomPosition = htmlHeight - editorHeight - editorTargetOffset.top

      if (editorHeight > htmlHeight) {
        document.body.style.height = editorHeight + 'px'
      }

      bottomPositionPx = Math.max(bottomPosition, 0) + 'px'
      leftPositionPx = editorTargetOffset.left + 'px'
    }

    baseEl.style.bottom = bottomPositionPx
    baseEl.style.left = leftPositionPx
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
  async handleConfirm(evt) {
    evt.persist()
    evt.preventDefault()

    const {
      editorTarget,
      isCreatingNewFolder,
      isUIForFolder
    } = this.props

    const newTitle = this.titleInputEl.value.trim()

    let newUrl
    if (!isUIForFolder) {
      newUrl = this.urlInputEl.value.trim()
    }

    if (isCreatingNewFolder) {
      await chromep.bookmarks.create({
        parentId: editorTarget.parentId,
        title: newTitle,
        url: newUrl,
        index: editorTarget.index + 1
      })
    } else {
      await chromep.bookmarks.update(editorTarget.id, {
        title: newTitle,
        url: newUrl
      })
    }

    this.closeEditor()
  }

  render() {
    const {
      editorTarget,
      isUIForFolder
    } = this.props

    const editorTitle = isUIForFolder ? msgRename : msgEdit
    const isHidden = !editorTarget

    return (
      <form
        ref={(ref) => {
          this.baseEl = ref
        }}
        styleName='main'
        hidden={isHidden}
      >
        <span styleName='title'>{editorTitle}</span>
        <input
          ref={(ref) => {
            this.titleInputEl = ref
          }}
          type='text'
        />
        <input
          ref={(ref) => {
            this.urlInputEl = ref
          }}
          type='text'
          hidden={isUIForFolder}
        />
        <button
          styleName='button'
          type='submit'
          onClick={this.handleConfirm}
        >
          {msgConfirm}
        </button>
        <button
          styleName='button'
          type='button'
          onClick={this.handleCancel}
        >
          {msgCancel}
        </button>
      </form>
    )
  }
}

Editor.propTypes = {
  dispatch: PropTypes.func.isRequired,
  editorTarget: PropTypes.object,
  isCreatingNewFolder: PropTypes.bool.isRequired,
  isUIForFolder: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => {
  const {
    editorTarget,
    isCreatingNewFolder
  } = state

  return {
    editorTarget: editorTarget,
    isCreatingNewFolder: isCreatingNewFolder,
    isUIForFolder: isCreatingNewFolder || (editorTarget ? isFolder(editorTarget) : false)
  }
}

export default connect(mapStateToProps)(
  CSSModules(Editor, styles)
)
