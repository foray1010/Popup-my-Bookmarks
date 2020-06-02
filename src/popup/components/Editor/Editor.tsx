import * as React from 'react'
import webExtension from 'webextension-polyfill'

import ActionlessForm from '../../../core/components/baseItems/ActionlessForm'
import Button from '../../../core/components/baseItems/Button'
import Input from '../../../core/components/baseItems/Input'
import classes from './editor.css'

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

  const formStyles: Record<string, string> = React.useMemo(
    () => ({
      '--width': `${props.width}px`,
    }),
    [props.width],
  )

  return (
    <ActionlessForm className={classes.main} style={formStyles}>
      <span className={classes.header}>{props.header}</span>

      <Input
        className={classes.input}
        value={title}
        onChange={handleTitleChange}
        autoFocus
      />
      {props.isAllowEditUrl && (
        <Input
          className={classes.input}
          value={url}
          onChange={handleUrlChange}
        />
      )}

      <Button type='submit' onClick={handleConfirm}>
        {webExtension.i18n.getMessage('confirm')}
      </Button>
      <Button onClick={props.onCancel}>
        {webExtension.i18n.getMessage('cancel')}
      </Button>
    </ActionlessForm>
  )
}

export default Editor
