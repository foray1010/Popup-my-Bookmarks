import PropTypes from 'prop-types'
import webExtension from 'webextension-polyfill'
import {createElement, PureComponent} from 'react'

import '../../../../css/popup/editor.css'
import {normalizeInputtingValue} from '../../../common/functions'
import {resetBodySize} from '../../functions'

class Editor extends PureComponent {
  state = {
    title: '',
    url: ''
  }

  componentWillReceiveProps(nextProps) {
    const {editorTarget, isCreatingNewFolder} = nextProps

    const isHidden = !editorTarget

    if (!isHidden) {
      this.setState({
        title: isCreatingNewFolder ? webExtension.i18n.getMessage('newFolder') : editorTarget.title,
        url: editorTarget.url || ''
      })
    } else {
      this.setState({
        title: '',
        url: ''
      })
    }
  }

  componentDidUpdate(prevProps) {
    const {editorTarget} = this.props

    const isHidden = !editorTarget

    if (editorTarget !== prevProps.editorTarget) {
      this.setEditorPosition()

      if (!isHidden) {
        // auto focus to first input field
        this.baseEl.querySelector('input[type="text"]').focus()
      } else {
        resetBodySize()
      }
    }
  }

  setEditorPosition() {
    const {editorTarget} = this.props

    const isHidden = !editorTarget

    let bottomPositionPx = ''
    let leftPositionPx = ''

    if (!isHidden) {
      const editorHeight = this.baseEl.offsetHeight
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

    this.baseEl.style.bottom = bottomPositionPx
    this.baseEl.style.left = leftPositionPx
  }

  handleCancel = () => {
    this.props.closeEditor()
  }

  handleConfirm = async (evt) => {
    evt.persist()
    evt.preventDefault()

    const {closeEditor, editorTarget, isCreatingNewFolder} = this.props

    const {title, url} = this.state

    if (isCreatingNewFolder) {
      await webExtension.bookmarks.create({
        parentId: editorTarget.parentId,
        title: title.trim(),
        index: editorTarget.index + 1
      })
    } else {
      await webExtension.bookmarks.update(editorTarget.id, {
        title,
        url: url.trim()
      })
    }

    closeEditor()
  }

  handleTitleChange = (evt) => {
    this.setState({
      title: normalizeInputtingValue(evt.target.value)
    })
  }

  handleUrlChange = (evt) => {
    this.setState({
      url: normalizeInputtingValue(evt.target.value)
    })
  }

  render() {
    const {editorTarget, isUIForFolder} = this.props

    const {title, url} = this.state

    const editorTitle = isUIForFolder ?
      webExtension.i18n.getMessage('rename') :
      webExtension.i18n.getMessage('edit')
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
        <input type='text' value={title} onChange={this.handleTitleChange} />
        <input type='text' value={url} hidden={isUIForFolder} onChange={this.handleUrlChange} />
        <button
          styleName='button'
          type='submit' // support `Enter` to submit
          onClick={this.handleConfirm}
        >
          {webExtension.i18n.getMessage('confirm')}
        </button>
        <button styleName='button' type='button' onClick={this.handleCancel}>
          {webExtension.i18n.getMessage('cancel')}
        </button>
      </form>
    )
  }
}

Editor.propTypes = {
  closeEditor: PropTypes.func.isRequired,
  editorTarget: PropTypes.object,
  isCreatingNewFolder: PropTypes.bool.isRequired,
  isUIForFolder: PropTypes.bool.isRequired
}

export default Editor
