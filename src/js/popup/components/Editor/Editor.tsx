import * as R from 'ramda'
import * as React from 'react'
import styled from 'styled-components'
import webExtension from 'webextension-polyfill'

import classes from '../../../../css/popup/editor.css'

interface FormProps {
  width: number
}
const Form = styled('form')<FormProps>`
  width: ${R.prop('width')}px;
`

interface Props {
  header: string
  isAllowEditUrl: boolean
  onCancel: () => void
  onConfirm: (title: string, url: string) => void
  title: string
  url: string
  width: number
}
interface State {
  title: string
  url: string
}
class Editor extends React.PureComponent<Props, State> {
  public state = {
    title: this.props.title,
    url: this.props.url
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.title !== this.props.title || prevProps.url !== this.props.url) {
      this.setState({
        title: this.props.title,
        url: this.props.url
      })
    }
  }

  private handleConfirm = () => {
    this.props.onConfirm(this.state.title, this.state.url)
  }

  private handleSubmit = (evt: React.FormEvent<HTMLElement>) => {
    evt.preventDefault()
  }

  private handleTitleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: evt.currentTarget.value
    })
  }

  private handleUrlChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      url: evt.currentTarget.value
    })
  }

  public render = () => (
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
