// @flow
// @jsx createElement

import '../../../../css/popup/mask.css'

import * as R from 'ramda'
import {Fragment, PureComponent, createElement} from 'react'
import {connect} from 'react-redux'
import webExtension from 'webextension-polyfill'

import {bookmarkCreators, editorCreators} from '../../reduxs'
import AbsPositionWithinBody from '../AbsPositionWithinBody'
import Mask from '../Mask'
import Editor from './Editor'

type Props = {|
  closeEditor: () => void,
  editBookmark: (string, string, string) => void,
  isAllowEditUrl: boolean,
  positionLeft: number,
  positionTop: number,
  targetId: string,
  title: string,
  url: string,
  width: number
|}
class EditorContainer extends PureComponent<Props> {
  handleConfirm = (title, url) => {
    this.props.editBookmark(this.props.targetId, title, url)
    this.props.closeEditor()
  }

  render = () => (
    <Fragment>
      <Mask backgroundColor='#fff' opacity={0.3} onClick={this.props.closeEditor} />
      <AbsPositionWithinBody
        positionLeft={this.props.positionLeft}
        positionTop={this.props.positionTop}
      >
        <Editor
          isAllowEditUrl={this.props.isAllowEditUrl}
          header={
            this.props.isAllowEditUrl ?
              webExtension.i18n.getMessage('edit') :
              webExtension.i18n.getMessage('rename')
          }
          title={this.props.title}
          url={this.props.url}
          width={this.props.width}
          onCancel={this.props.closeEditor}
          onConfirm={this.handleConfirm}
        />
      </AbsPositionWithinBody>
    </Fragment>
  )
}

const mapStateToProps = (state) => ({
  ...R.pick(
    ['isAllowEditUrl', 'positionLeft', 'positionTop', 'targetId', 'title', 'url'],
    state.editor
  ),
  width: state.options.setWidth
})

const mapDispatchToProps = {
  ...R.pick(['editBookmark'], bookmarkCreators),
  ...R.pick(['closeEditor'], editorCreators)
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorContainer)
