import {autobind} from 'core-decorators'
import {createElement, PropTypes, PureComponent} from 'react'
import {static as Immutable} from 'seamless-immutable'
import CSSModules from 'react-css-modules'

import {
  resetBodySize
} from '../../functions'
import chromep from '../../../common/lib/chromePromise'

import styles from '../../../../css/popup/editor.css'

const msgCancel = chrome.i18n.getMessage('cancel')
const msgConfirm = chrome.i18n.getMessage('confirm')
const msgEdit = chrome.i18n.getMessage('edit')
const msgNewFolder = chrome.i18n.getMessage('newFolder')
const msgRename = chrome.i18n.getMessage('rename')

class Editor extends PureComponent {
  constructor(...args) {
    super(...args)

    this.state = Immutable({
      title: '',
      url: ''
    })
  }

  componentWillReceiveProps(nextProps) {
    const {
      editorTarget,
      isCreatingNewFolder
    } = nextProps

    const isHidden = !editorTarget

    if (!isHidden) {
      this.setState({
        title: isCreatingNewFolder ? msgNewFolder : editorTarget.title,
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
    const {
      editorTarget
    } = this.props

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

  @autobind
  handleCancel() {
    this.props.closeEditor()
  }

  @autobind
  async handleConfirm(evt) {
    evt.persist()
    evt.preventDefault()

    const {
      closeEditor,
      editorTarget,
      isCreatingNewFolder
    } = this.props

    const {
      title,
      url
    } = this.state

    if (isCreatingNewFolder) {
      await chromep.bookmarks.create({
        parentId: editorTarget.parentId,
        title: title.trim(),
        index: editorTarget.index + 1
      })
    } else {
      await chromep.bookmarks.update(editorTarget.id, {
        title: title,
        url: url.trim()
      })
    }

    closeEditor()
  }

  @autobind
  handleTitleChange(evt) {
    this.setState({
      title: evt.target.value.trimLeft().replace(/\s+/g, ' ')
    })
  }

  @autobind
  handleUrlChange(evt) {
    this.setState({
      url: evt.target.value.trimLeft().replace(/\s+/g, ' ')
    })
  }

  render() {
    const {
      editorTarget,
      isUIForFolder
    } = this.props

    const {
      title,
      url
    } = this.state

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
          type='text'
          value={title}
          onChange={this.handleTitleChange}
        />
        <input
          type='text'
          value={url}
          hidden={isUIForFolder}
          onChange={this.handleUrlChange}
        />
        <button
          styleName='button'
          type='submit' // support `Enter` to submit
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
  closeEditor: PropTypes.func.isRequired,
  editorTarget: PropTypes.object,
  isCreatingNewFolder: PropTypes.bool.isRequired,
  isUIForFolder: PropTypes.bool.isRequired
}

export default CSSModules(Editor, styles)
