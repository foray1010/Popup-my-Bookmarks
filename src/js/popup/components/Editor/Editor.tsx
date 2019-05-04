import * as React from 'react'
import webExtension from 'webextension-polyfill'

import classes from '../../../../css/popup/editor.css'

const handleSubmit = (evt: React.FormEvent<HTMLElement>) => {
  evt.preventDefault()
}

interface Props {
  header: string
  initialTitle: string
  initialUrl: string
  isAllowEditUrl: boolean
  onCancel: () => void
  onConfirm: (title: string, url: string) => void
  width: number
}
const Editor = (props: Props) => {
  const {onConfirm} = props

  const [title, setTitle] = React.useState(props.initialTitle)
  const [url, setUrl] = React.useState(props.initialUrl)

  const handleConfirm = React.useCallback(() => {
    onConfirm(title, url)
  }, [onConfirm, title, url])

  const handleTitleChange = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.currentTarget.value)
  }, [])

  const handleUrlChange = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(evt.currentTarget.value)
  }, [])

  const formStyles = React.useMemo(
    (): object => ({
      '--width': `${props.width}px`
    }),
    [props.width]
  )

  return (
    <form className={classes.main} style={formStyles} onSubmit={handleSubmit}>
      <span className={classes.header}>{props.header}</span>

      <input type='text' value={title} onChange={handleTitleChange} autoFocus />
      {props.isAllowEditUrl && <input type='text' value={url} onChange={handleUrlChange} />}

      <button
        className={classes.button}
        type='submit' // support `Enter` to submit
        onClick={handleConfirm}
      >
        {webExtension.i18n.getMessage('confirm')}
      </button>
      <button className={classes.button} type='button' onClick={props.onCancel}>
        {webExtension.i18n.getMessage('cancel')}
      </button>
    </form>
  )
}

export default Editor
