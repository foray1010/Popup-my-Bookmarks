// @flow strict

import * as R from 'ramda'
import * as React from 'react'
import styled from 'styled-components'
import webExtension from 'webextension-polyfill'

import classes from '../../../../css/popup/editor.css'

const Form = styled('form')`
  width: ${R.prop('width')}px;
`

type Props = {|
  header: string,
  isAllowEditUrl: boolean,
  onCancel: () => void,
  onConfirm: (string, string) => void,
  title: string,
  url: string,
  width: number
|}
type State = {|
  title: string,
  url: string
|}
class Editor extends React.PureComponent<Props, State> {
  state = {
    title: this.props.title,
    url: this.props.url
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.title !== this.props.title || prevProps.url !== this.props.url) {
      this.setState({
        title: this.props.title,
        url: this.props.url
      })
    }
  }

  generateHandleChange = (stateName: string) => (evt: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      [stateName]: evt.currentTarget.value
    })
  }

  handleConfirm = () => {
    this.props.onConfirm(this.state.title, this.state.url)
  }

  handleSubmit = (evt: SyntheticEvent<HTMLElement>) => {
    evt.preventDefault()
  }

  handleTitleChange = this.generateHandleChange('title')
  handleUrlChange = this.generateHandleChange('url')

  render = () => (
    <Form className={classes.main} width={this.props.width} onSubmit={this.handleSubmit}>
      <span className={classes.header}>{this.props.header}</span>

      <input type='text' value={this.state.title} onChange={this.handleTitleChange} autoFocus />
      {this.props.isAllowEditUrl && (
        <input type='text' value={this.state.url} onChange={this.handleUrlChange} />
      )}

      <button
        className={classes.button}
        type='submit' // support `Enter` to submit
        onClick={this.handleConfirm}
      >
        {webExtension.i18n.getMessage('confirm')}
      </button>
      <button className={classes.button} type='button' onClick={this.props.onCancel}>
        {webExtension.i18n.getMessage('cancel')}
      </button>
    </Form>
  )
}

export default Editor
