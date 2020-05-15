import * as React from 'react'
import webExtension from 'webextension-polyfill'

import Button from '../../../core/components/baseItems/Button'
import classes from './editor.css'

const handleSubmit = (evt: React.FormEvent) => {
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
  const { onConfirm } = props

  const [title, setTitle] = React.useState(props.initialTitle)
  const [url, setUrl] = React.useState(props.initialUrl)

  const handleConfirm = React.useCallback(() => {
    onConfirm(title, url)
  }, [onConfirm, title, url])

  const handleTitleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(evt.currentTarget.value)
    },
    [],
  )

  const handleUrlChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(evt.currentTarget.value)
    },
    [],
  )

  const formStyles: object = React.useMemo(
    () => ({
      '--width': `${props.width}px`,
    }),
    [props.width],
  )

  return (
    <form className={classes.main} style={formStyles} onSubmit={handleSubmit}>
      <span className={classes.header}>{props.header}</span>

      <input
        className={classes.input}
        type='text'
        value={title}
        onChange={handleTitleChange}
        autoFocus
      />
      {props.isAllowEditUrl && (
        <input
          className={classes.input}
          type='text'
          value={url}
          onChange={handleUrlChange}
        />
      )}

      <Button
        type='submit' // support `Enter` to submit
        onClick={handleConfirm}
      >
        {webExtension.i18n.getMessage('confirm')}
      </Button>
      <Button onClick={props.onCancel}>
        {webExtension.i18n.getMessage('cancel')}
      </Button>
    </form>
  )
}

export default Editor
